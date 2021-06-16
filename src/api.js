import axios from "axios";

// axios가 가지고 있는 create()함수를 이용해서 함수 내부에 객체형태로 axios의 초기설정을 해줄 수 있다.
// baseURL에는 API를 요청하는 기본 URL을, params에는 URL에 들어가는 api_key와 language에 대한 정보를 객체형태로 적어준다.
// params 객체 안에 입력한 값들은 baseURL의 URL주소 뒤에 붙어서 들어간다.
// (ex: https://api.themoviedb.org/3/tv/popular?api_key=d20d691c4dcca268fa8e0c655d698616&language=en-US)
// 아래와 같이 설정해주게 되면 이제 우리가 API를 요청할 때 아래에 설정한 값들을 가지고 요청하게 된다.
const api = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  params: {
    api_key: "d20d691c4dcca268fa8e0c655d698616",
    language: "en-US",
  },
});

// 위에 설정을 해줬다면 이젠 get()함수를 통해 get방식으로 해당 주소로 API를 요청하면 된다.
// 주의할 점은 /tv/popular가 아닌 tv/popular로 써줘야 한다.
// 만약 /로 시작하게 되면 그것은 절대경로를 의미하고 그렇다면 위에 baseURL의 URL을 덮어씌워버리기 때문이다.
// 우리는 상대경로를 써서 https://api.themoviedb.org/3/tv/popular로 요청해야 한다.
// api.get("tv/popular");

// moviesApi와 tvApi객체를 생성해서 Movie와 TV각각에 해당하는 API를 안에 담아서 힌 번에 관리할 수 있도록 한다.
// moviesApi와 tvApi 객체안에 프로퍼티를 만들고 각각의 프로퍼티는 api.get()을 통해 URL주소로 요청하고 요청한 결과 값을 반환해준다.
export const moviesApi = {
  nowPlaying: () => api.get("movie/now_playing"),
  upcoming: () => api.get("movie/upcoming"),
  popular: () => api.get("movie/popular"),
  // movieDetail의 함수는 id값을 받고  그 id를 이용해서 api를 요청한다.
  // api.get(`movie/${id}`,{})에서 두 번째 인자로 {}객체를 쓰고 그 안에 추가적인 params를 써줄 수 있다.
  // 이런 방식을 통해 라우터, 파라미터들을 개별적으로 설정할 수 있다.
  // 그렇게되면 movie/${id}/에서 append_to_response=videos가 추가적으로 붙게된다.
  // 또한 append_to_response으로 video나 image등을 params로 같이 전달하게 되면 결과 값으로 id, key(유튜브 예고편의 URL주소), 이름, site, size 등의 정보를 준다.
  movieDetail: (id) =>
    api.get(`movie/${id}`, {
      params: {
        append_to_response: "videos",
      },
    }),
  // search함수는 term값을 받고 term을 이용해서 검색한다.
  // 위에 movieDetail은 append_to_response에 값을 넣어 전달했지만 아래 search는 params로 query안에 값을 전달해야 한다.
  // append_to_response, query등의 이름은 변경 불가하다.
  search: (term) =>
    api.get("search/movie", {
      params: {
        query: term,
        // 만약 인자 term에 문자열+빈칸 형태로 값이 오게 되면 (ex: hello Cody! => hello%20Cody%21) %20 이런식으로 나오게 된다.
        // 예를들어 사용자가 @를 입력하면 URL에 인코딩되 변환되서 들어가야 한다. 왜냐하면 term은 string으로 되어야 하기 때문이다.
        // 그래서 우리는 이것을 처리하는 부분이 필요하다. 그 때 사용하는 것이 encodeURIComponent이다.
        // 즉 어떤 term값을 넘기든 encodeURIComponent()함수를 통해 값을 인코딩하고 그 문자열을 검색한다.
        // axios에서 기본적으로 encodeURIComponent을 지원해주기 때문에 굳이 쓰지 않아도 됨
        // query: encodeURIComponent(term),
      },
    }),
};

export const tvApi = {
  topRated: () => api.get("tv/top_rated"),
  popular: () => api.get("tv/popular"),
  airingToday: () => api.get("tv/airing_today"),
  tvDetail: (id) =>
    api.get(`tv/${id}`, {
      params: {
        append_to_response: "videos",
      },
    }),
};

export default api;