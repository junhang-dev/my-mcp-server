import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const apiKey = process.env.MISO_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      {
        error: true,
        detail: "MISO_API_KEY 환경변수가 설정되지 않았습니다.",
        solution:
          "프로젝트 설정에서 MISO_API_KEY 환경변수를 추가해주세요.",
      },
      { status: 500 }
    )
  }

  try {
    const body = await request.json()
    const { text1 } = body

    if (!text1 || typeof text1 !== "string") {
      return NextResponse.json(
        {
          error: true,
          detail: "보고서 생성에 필요한 텍스트 데이터가 누락되었습니다.",
          solution: "대시보드 데이터를 올바르게 전달해주세요.",
        },
        { status: 400 }
      )
    }

    const misoResponse = await fetch(
      "https://api.aiu.gscaltex.com/ext/v1/workflows/run",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: {
            text1,
          },
          mode: "blocking",
          user: "heat-sync-dashboard",
        }),
      }
    )

    if (!misoResponse.ok) {
      const errorData = await misoResponse.json().catch(() => null)
      const statusCode = misoResponse.status

      let detail = "MISO API 호출 중 오류가 발생했습니다."
      let solution = "잠시 후 다시 시도해주세요."

      if (statusCode === 400) {
        const code = errorData?.code
        if (code === "invalid_param") {
          detail = "잘못된 파라미터가 전달되었습니다."
          solution =
            errorData?.message?.includes("not published")
              ? "미소 앱 편집화면에서 저장 버튼을 눌러 발행해주세요."
              : "입력 데이터를 확인 후 다시 시도해주세요."
        } else if (code === "app_unavailable") {
          detail = "앱(App) 설정 정보를 사용할 수 없습니다."
          solution = "미소 앱이 올바르게 설정되어 있는지 확인해주세요."
        } else if (code === "provider_not_initialize") {
          detail = "사용 가능한 모델 인증 정보가 없습니다."
          solution = "미소 플랫폼에서 모델 인증 설정을 확인해주세요."
        } else if (code === "provider_quota_exceeded") {
          detail = "모델 호출 쿼터(Quota)가 초과되었습니다."
          solution =
            "사용량 한도를 확인하고, 필요 시 쿼터를 증가시켜주세요."
        } else if (code === "model_currently_not_support") {
          detail = "현재 모델을 사용할 수 없습니다."
          solution = "다른 모델을 선택하거나, 잠시 후 다시 시도해주세요."
        } else if (code === "workflow_request_error") {
          detail = "워크플로우 실행에 실패했습니다."
          solution =
            "워크플로우 설정을 확인하고 다시 시도해주세요."
        }
      } else if (statusCode === 500) {
        detail = "MISO 서버 내부 오류가 발생했습니다."
        solution = "잠시 후 다시 시도해주세요. 문제가 지속되면 관리자에게 문의하세요."
      }

      return NextResponse.json(
        { error: true, detail, solution, raw: errorData },
        { status: statusCode }
      )
    }

    const data = await misoResponse.json()

    if (data.status === "failed" || data.error) {
      return NextResponse.json(
        {
          error: true,
          detail: data.error || "워크플로우 실행 중 오류가 발생했습니다.",
          solution: "입력 데이터를 확인한 후 다시 시도해주세요.",
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      file: data.outputs?.file ?? null,
      workflowRunId: data.id,
      elapsedTime: data.elapsed_time,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: true,
        detail: "보고서 생성 요청 중 네트워크 오류가 발생했습니다.",
        solution:
          "인터넷 연결을 확인하고 다시 시도해주세요.",
      },
      { status: 500 }
    )
  }
}
