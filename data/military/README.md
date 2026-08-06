# 군사특기 원본 데이터 레이어

`generated/official-specialty-master.json`은 병무청 군사특기마스터 OpenAPI에서 동기화한 공식 특기 기준 데이터입니다.

같은 특기가 여러 모집 회차에 등장하는 API 특성상, 동기화 과정에서 `군종 + 특기코드` 기준으로 하나의 특기로 합칩니다. `rawRecruitmentRecordCount`는 받은 모집 공고 수, `specialtyCount`는 중복을 제거한 특기 수입니다.

- 실행 명령: npm run sync:specialties
- 원본은 공식 명칭·코드·군 구분·모집 일정 보존용입니다.
- 특급꿀벌의 성향 설명과 추천 점수는 별도의 편집 레이어에서 관리합니다.
- 모집 상태와 지원 가능 여부는 최신 공식 모집 공고로 다시 검증해야 합니다.
