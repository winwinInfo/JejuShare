export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-6xl px-5 py-10">
        <p className="break-keep text-xs leading-relaxed text-muted-foreground xl:whitespace-nowrap">
          운영: 주식회사 제주시트러스랩스 · 본 프로젝트는 2026 제주생활실험
          사업의 일환으로 진행되며, 부산물 정보 및 활용 아이디어 데이터는
          제주특별자치도 소통협력센터에 귀속되어 공공누리 제2유형으로
          공개됩니다.
        </p>
        <div className="mt-6 space-y-0.5 text-xs leading-relaxed text-muted-foreground">
          <p>주식회사 제주시트러스랩스 · 대표이사 이창현</p>
          <p>제주특별자치도 서귀포시 중정로 86 서귀포스타트업베이 3층 302-1호</p>
          <p>사업자등록번호 690-81-03449</p>
        </div>
      </div>
    </footer>
  )
}
