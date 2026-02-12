import { createMcpHandler } from 'mcp-handler'
import { z } from 'zod'
import { InferenceClient } from '@huggingface/inference'

const handler = createMcpHandler(
    (server) => {
        // 도구: 인사하기
        server.tool(
            'greeting',
            '이름과 언어를 지정하여 인사합니다',
            {
                name: z.string().describe('인사할 사람의 이름'),
                language: z
                    .enum(['ko', 'en'])
                    .optional()
                    .default('ko')
                    .describe('인사 언어 (기본값: ko)')
            },
            async ({ name, language }) => {
                const greeting =
                    language === 'ko'
                        ? `안녕하세요, ${name}님! 😊`
                        : `Hello, ${name}! 👋`

                return {
                    content: [{ type: 'text', text: greeting }]
                }
            }
        )

        // 도구: 계산기
        server.tool(
            'calculator',
            '사칙연산을 수행합니다 (add, subtract, multiply, divide)',
            {
                operation: z
                    .enum(['add', 'subtract', 'multiply', 'divide'])
                    .describe(
                        '수행할 연산 (add, subtract, multiply, divide)'
                    ),
                a: z.number().describe('첫 번째 숫자'),
                b: z.number().describe('두 번째 숫자')
            },
            async ({ operation, a, b }) => {
                let result: number
                switch (operation) {
                    case 'add':
                        result = a + b
                        break
                    case 'subtract':
                        result = a - b
                        break
                    case 'multiply':
                        result = a * b
                        break
                    case 'divide':
                        if (b === 0)
                            throw new Error('0으로 나눌 수 없습니다')
                        result = a / b
                        break
                    default:
                        throw new Error('지원하지 않는 연산입니다')
                }

                const operationSymbols = {
                    add: '+',
                    subtract: '-',
                    multiply: '×',
                    divide: '÷'
                } as const

                const operationSymbol =
                    operationSymbols[
                        operation as keyof typeof operationSymbols
                    ]

                return {
                    content: [
                        {
                            type: 'text',
                            text: `${a} ${operationSymbol} ${b} = ${result}`
                        }
                    ]
                }
            }
        )

        // 도구: 시간 조회
        server.tool(
            'get_time',
            '지정한 시간대의 현재 시간을 조회합니다',
            {
                timeZone: z.string().describe('시간대')
            },
            async ({ timeZone }) => {
                return {
                    content: [
                        {
                            type: 'text',
                            text: new Date().toLocaleString('ko-KR', {
                                timeZone
                            })
                        }
                    ]
                }
            }
        )

        // 도구: 이미지 생성
        server.tool(
            'generate_image',
            'Hugging Face FLUX.1-schnell 모델로 이미지를 생성합니다',
            {
                prompt: z.string().describe('이미지 생성을 위한 프롬프트')
            },
            async ({ prompt }) => {
                try {
                    if (!process.env.HF_TOKEN) {
                        throw new Error(
                            'HF_TOKEN 환경변수가 설정되지 않았습니다'
                        )
                    }

                    const client = new InferenceClient(process.env.HF_TOKEN)

                    const imageBlob = await client.textToImage({
                        provider: 'fal-ai',
                        model: 'black-forest-labs/FLUX.1-schnell',
                        inputs: prompt,
                        parameters: { num_inference_steps: 5 }
                    })

                    const arrayBuffer = await (
                        imageBlob as unknown as Blob
                    ).arrayBuffer()
                    const buffer = Buffer.from(arrayBuffer)
                    const base64Data = buffer.toString('base64')

                    return {
                        content: [
                            {
                                type: 'image' as const,
                                data: base64Data,
                                mimeType: 'image/png'
                            }
                        ]
                    }
                } catch (error) {
                    throw new Error(
                        `이미지 생성 중 오류가 발생했습니다: ${
                            error instanceof Error
                                ? error.message
                                : '알 수 없는 오류'
                        }`
                    )
                }
            }
        )

        // 도구: 지오코딩
        server.tool(
            'geocode',
            '주소 또는 도시명으로 좌표를 검색합니다 (OpenStreetMap Nominatim)',
            {
                query: z.string().describe('검색할 도시 이름 또는 주소'),
                limit: z
                    .number()
                    .min(1)
                    .max(40)
                    .optional()
                    .default(1)
                    .describe('반환할 결과 수 (기본값: 1, 최대: 40)'),
                addressdetails: z
                    .boolean()
                    .optional()
                    .default(true)
                    .describe('주소 세부 정보 포함 여부')
            },
            async ({ query, limit, addressdetails }) => {
                const url = new URL(
                    'https://nominatim.openstreetmap.org/search'
                )
                url.searchParams.set('q', query)
                url.searchParams.set('format', 'jsonv2')
                url.searchParams.set('limit', String(limit))
                url.searchParams.set(
                    'addressdetails',
                    addressdetails ? '1' : '0'
                )

                const response = await fetch(url.toString(), {
                    headers: {
                        'User-Agent': 'typescript-mcp-server/1.0.0',
                        'Accept-Language': 'ko,en'
                    }
                })

                if (!response.ok) {
                    throw new Error(
                        `Nominatim API 오류: ${response.status}`
                    )
                }

                const results = await response.json()

                if (!results || results.length === 0) {
                    return {
                        content: [
                            {
                                type: 'text',
                                text: `"${query}"에 대한 검색 결과가 없습니다.`
                            }
                        ]
                    }
                }

                const formatted = results.map((r: any) => ({
                    name: r.display_name,
                    latitude: parseFloat(r.lat),
                    longitude: parseFloat(r.lon),
                    type: r.type,
                    importance: r.importance,
                    address: r.address
                }))

                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(formatted, null, 2)
                        }
                    ]
                }
            }
        )

        // 도구: 날씨 정보
        server.tool(
            'get_weather',
            '좌표 기반 날씨 예보를 조회합니다 (Open-Meteo API)',
            {
                latitude: z
                    .number()
                    .min(-90)
                    .max(90)
                    .describe('위도 (WGS84)'),
                longitude: z
                    .number()
                    .min(-180)
                    .max(180)
                    .describe('경도 (WGS84)'),
                timezone: z
                    .string()
                    .optional()
                    .default('auto')
                    .describe('시간대 (기본값: auto - 자동 감지)'),
                forecast_days: z
                    .number()
                    .min(1)
                    .max(16)
                    .optional()
                    .default(3)
                    .describe('예보 일수 (기본값: 3, 최대: 16)')
            },
            async ({ latitude, longitude, timezone, forecast_days }) => {
                const url = new URL(
                    'https://api.open-meteo.com/v1/forecast'
                )
                url.searchParams.set('latitude', String(latitude))
                url.searchParams.set('longitude', String(longitude))
                url.searchParams.set('timezone', timezone)
                url.searchParams.set(
                    'forecast_days',
                    String(forecast_days)
                )
                url.searchParams.set(
                    'current',
                    'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m'
                )
                url.searchParams.set(
                    'daily',
                    'temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code'
                )

                const response = await fetch(url.toString(), {
                    headers: {
                        'User-Agent': 'typescript-mcp-server/1.0.0'
                    }
                })

                if (!response.ok) {
                    throw new Error(
                        `Open-Meteo API 오류: ${response.status}`
                    )
                }

                const data = await response.json()

                if (data.error) {
                    throw new Error(
                        `Open-Meteo API 오류: ${
                            data.reason || '알 수 없는 오류'
                        }`
                    )
                }

                const formatted = {
                    location: {
                        latitude: data.latitude,
                        longitude: data.longitude,
                        timezone: data.timezone,
                        elevation: data.elevation
                    },
                    current: data.current
                        ? {
                              temperature: data.current.temperature_2m,
                              humidity:
                                  data.current.relative_humidity_2m,
                              weather_code: data.current.weather_code,
                              wind_speed: data.current.wind_speed_10m,
                              time: data.current.time
                          }
                        : null,
                    daily: data.daily
                        ? {
                              time: data.daily.time,
                              temperature_max:
                                  data.daily.temperature_2m_max,
                              temperature_min:
                                  data.daily.temperature_2m_min,
                              precipitation:
                                  data.daily.precipitation_sum,
                              weather_code: data.daily.weather_code
                          }
                        : null,
                    units: {
                        temperature:
                            data.current_units?.temperature_2m || '°C',
                        humidity:
                            data.current_units?.relative_humidity_2m ||
                            '%',
                        wind_speed:
                            data.current_units?.wind_speed_10m ||
                            'km/h',
                        precipitation:
                            data.daily_units?.precipitation_sum || 'mm'
                    }
                }

                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(formatted, null, 2)
                        }
                    ]
                }
            }
        )

        // 리소스: 서버 정보
        server.resource(
            'server-info',
            'server://info',
            { mimeType: 'application/json' },
            async (uri) => {
                const serverInfo = {
                    name: 'typescript-mcp-server',
                    version: '1.0.0',
                    description:
                        'TypeScript MCP Server 보일러플레이트',
                    timestamp: new Date().toISOString(),
                    nodeVersion: process.version,
                    platform: process.platform
                }

                return {
                    contents: [
                        {
                            uri: uri.href,
                            mimeType: 'application/json',
                            text: JSON.stringify(serverInfo, null, 2)
                        }
                    ]
                }
            }
        )

        // 프롬프트: 코드 리뷰
        server.prompt(
            'code_review',
            'Request Code Review',
            {
                code: z.string().describe('The code to review')
            },
            async ({ code }) => {
                return {
                    messages: [
                        {
                            role: 'user' as const,
                            content: {
                                type: 'text' as const,
                                text: `다음 코드를 분석하고 상세한 리뷰를 제공해주세요:\n\n1. 코드 품질 평가\n2. 개선 가능한 부분\n3. 모범 사례 권장사항\n4. 보안 고려사항\n\n리뷰할 코드:\n\n\`\`\`\n${code}\n\`\`\``
                            }
                        }
                    ]
                }
            }
        )
    },
    {
        serverInfo: {
            name: 'typescript-mcp-server',
            version: '1.0.0'
        }
    },
    {
        basePath: '/api',
        maxDuration: 60
    }
)

export { handler as GET, handler as POST, handler as DELETE }
