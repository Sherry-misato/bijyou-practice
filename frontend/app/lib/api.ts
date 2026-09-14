// FastAPIのベースURL
export const API_BASE_URL = "http://localhost:8000";

// 型定義（DBのモデルに対応）
export type Pas = {
  id: number;
  french: string;
  japanese: string;
  meaning: string;
  movement: string;
  caution: string;
  used_scene: string;
  sample_video_url: string | null;
};

export type LessonLog = {
  id: number;
  date: string;
  content: string;
  created_at: string;
};

export type Todo = {
  id: number;
  content: string;
  done: boolean;
  created_at: string;
};

export type QuizQuestion = {
  id: number;
  question: string;
  choices: string[];
  answer_index: number;
};

export type QuizAnswerResult = {
  correct: boolean;
  correct_index: number;
};

// 共通fetchラッパー：エラー時は例外を投げる
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`APIエラーが発生しました（${res.status}）`);
  }

  // DELETEなどでbodyが無い場合の対策
  const text = await res.text();
  return text ? (JSON.parse(text) as T) : (undefined as T);
}

// ---- パ辞書 ----
export const fetchPasList = () => request<Pas[]>("/pas");

// ---- レッスン日記 ----
export const fetchLogs = () => request<LessonLog[]>("/logs");
export const createLog = (data: { date: string; content: string }) =>
  request<LessonLog>("/logs", { method: "POST", body: JSON.stringify(data) });
export const deleteLog = (id: number) =>
  request<{ message: string }>(`/logs/${id}`, { method: "DELETE" });

// ---- TODO ----
export const fetchTodos = () => request<Todo[]>("/todos");
export const createTodo = (content: string) =>
  request<Todo>("/todos", { method: "POST", body: JSON.stringify({ content }) });
export const updateTodo = (id: number, data: { content?: string; done?: boolean }) =>
  request<Todo>(`/todos/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteTodo = (id: number) =>
  request<{ message: string }>(`/todos/${id}`, { method: "DELETE" });

// ---- クイズ ----
export const fetchQuizQuestions = () => request<QuizQuestion[]>("/quiz");
export const answerQuiz = (questionId: number, selectedIndex: number) =>
  request<QuizAnswerResult>("/quiz", {
    method: "POST",
    body: JSON.stringify({ question_id: questionId, selected_index: selectedIndex }),
  });
