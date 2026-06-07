  import { createServerClient } from '@supabase/ssr'
  import { NextResponse, type NextRequest } from 'next/server'


  /*
    브라우저 -> next js 서버로 오는 모든 요청이 자동으로 여길 거쳐가게 됨 (proxy(요청) 이렇게 호출)
    요청마다 실행 컨텍스트가 새로 생긴다는 개념이 낯설다...
    아무튼 그렇기에 싱글톤 하나 만들어서 계속 쓰는게 아니라 요청마다 supabase 클라이언트를 새로 만들어준다.

    그리고 여기서 서버쪽 코드에서 쿠키를 읽는 방식이었던 next/headers의 cookies()를 사용해봤자, 
    미들웨어는 AsyncLocalStorage에 응답이 저장되기 전 호출되니까 쿠키를 읽을 수 없다. 그래서 아예 사용 못하도록 막아놨다.
    */
  export async function proxy(request: NextRequest) {

    // request를 그대로 통과시킨다는 내용의 응답. reuquest를 보내고 결과를 받는건 아님
    const response = NextResponse.next({ request })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: (toSet) => {
            toSet.forEach(({ name, value, options }) => {
              request.cookies.set(name, value)
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    // 현재 세션 사용자에 대한 정보 가져오기. + 토큰 만료되었으면 갱신 <- 이게 진짜 목적(getUser가 리턴하는 정보는 안씀)
    // JWT를 내부적으로 검사하여 만료 시간이 얼마 남지 않았을 때에만 HTTP 요청이 나간다
    // 그래서 지연에 대한 걱정을 덜어도 된다
    await supabase.auth.getUser()

    return response
  }

  export const config = {
    //  모든 경로에서 실행하되, Next.js 내부 파일(_next/static 등)과 favicon.ico는 제외하는 설정
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
  }