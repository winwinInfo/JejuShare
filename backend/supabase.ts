import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/backend/database.types'

// Config
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!


// 공개 데이터 조회용 (로그인 안해도 주는 정보들은 이걸 사용)
// flowType: 'pkce' — 매직링크를 ?code= 방식으로 받기 위해 필요
export const supabasePublic = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: 'pkce',
  },
})


// 유저 세션 필요한 서버 컴포넌트 / 서버 액션에서 호출
export async function createSupabaseServer() {
    //호출될 때마다 쿠키를 새로 받아온다. 
    // 현재 들어온 HTTP 요청의 쿠키 전체를 읽어온다. 
    /*
        request를 받지 않는데 어떻게 '현재 들어온 HTTP 요청'의 쿠키를 읽을 수 있는지?
        next js는 들어온 http 요청을 [AsyncLocalStorage]에 저장해두고 이는 일종의 전역변수이기에 cookies()가 알아서 접근해서 가져온다.
        C#/CPP의 ThreadLocalStorage와 비슷한 개념으로 보인다
        따라서 요청 받은 후에만 호출할 것.
    */
    const cookieStore = await cookies()
    return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
        cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (toSet) =>
            toSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
            ),
        },
    })
}
