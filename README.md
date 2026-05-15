# sports-mate

이 프로젝트는 사용자가 스마트폰 또는 다른 장치에서 수집한 건강 데이터를 새로 만든 프로그램에 수동으로 입력하는 방식을 구현합니다.

## 실행 방법

1. 의존성 설치

```bash
npm install
```

2. 서버 시작

```bash
node index.js
```

3. 브라우저에서 열기

```
http://localhost:3000
```

## 기능

- `GET /` : 운동/건강 데이터 수동 입력 폼 제공
- `POST /api/health` : 수동 입력된 건강 데이터를 저장
- `GET /api/health` : 저장된 건강 데이터 조회
- `GET /api/data` : 쿼리 파라미터를 JSON으로 반환
- `GET /api/ai?prompt=질문` : AI에게 운동/건강 관련 질문을 전달하고 답변을 받음

## 환경 변수 설정

프로젝트 루트에 `.env` 파일을 만들고 아래 내용을 추가하세요.

```bash
AI_GATEWAY_API_KEY=
```

`.env` 파일은 이미 `.gitignore`에 등록되어 있으므로 GitHub에 업로드되지 않습니다.

## 사용 방법

웹 폼에서 날짜, 걸음 수 등을 입력하면 프로그램에서 데이터를 수동으로 받을 수 있습니다.

AI 질의 기능은 다음과 같이 사용할 수 있습니다.

```bash
http://localhost:3000/api/ai?prompt=운동할 때 주의할 점은 무엇인가요?
```
