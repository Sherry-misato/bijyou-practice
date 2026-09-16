"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  Spinner,
  Button,
  RadioGroup,
} from "@chakra-ui/react";
import { fetchQuizQuestions, answerQuiz, QuizQuestion } from "../lib/api";
import PageHeader from "../components/PageHeader";

export default function QuizPage() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ correct: boolean; correctIndex: number } | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    fetchQuizQuestions()
      .then(setQuestions)
      .catch(() => setError("クイズの読み込みに失敗しました。"))
      .finally(() => setLoading(false));
  }, []);

  const currentQuestion = questions[currentIndex];

  const handleSubmitAnswer = async () => {
    if (submitting || selected === null || !currentQuestion) return;
    setSubmitting(true);
    try {
      const result = await answerQuiz(currentQuestion.id, Number(selected));
      setFeedback({ correct: result.correct, correctIndex: result.correct_index });
      if (result.correct) setScore((s) => s + 1);
    } catch {
      setError("回答の送信に失敗しました。");
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    setSelected(null);
    setFeedback(null);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
    } else {
      setFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelected(null);
    setFeedback(null);
    setScore(0);
    setFinished(false);
  };

  return (
    <Container maxW="600px" px={{ base: "4", md: "6" }} py="8">
      <PageHeader
        emoji="🎓"
        frenchSubtitle="Petit quiz de ballet"
        title="クイズ"
        description="パの名前や意味をクイズ形式で復習しましょう。"
      />

      {loading && (
        <Stack align="center" py="10">
          <Spinner color="pink.400" size="lg" />
        </Stack>
      )}

      {!loading && error && (
        <Box bg="red.50" borderWidth="1px" borderColor="red.200" borderRadius="xl" p="4">
          <Text color="red.600" fontSize="sm">
            {error}
          </Text>
        </Box>
      )}

      {!loading && !error && questions.length === 0 && (
        <Box bg="white" borderWidth="1px" borderColor="pink.100" borderRadius="xl" p="8" textAlign="center">
          <Text color="gray.500" fontSize="sm">
            まだクイズが登録されていません。
          </Text>
        </Box>
      )}

      {!loading && !error && questions.length > 0 && !finished && currentQuestion && (
        <Box className="bijyou-card" bg="white" borderWidth="1px" borderColor="pink.100" borderRadius="xl" p="6" boxShadow="sm">
          <Text fontSize="xs" color="gray.500" mb="2">
            {currentIndex + 1} / {questions.length} 問
          </Text>
          <Heading fontSize="lg" mb="4" color="gray.800">
            {currentQuestion.question}
          </Heading>

          <RadioGroup.Root
            value={selected ?? ""}
            onValueChange={(e) => setSelected(e.value)}
            disabled={feedback !== null}
          >
            <Stack gap="3">
              {currentQuestion.choices.map((choice, idx) => (
                <RadioGroup.Item key={idx} value={String(idx)}>
                  <RadioGroup.ItemHiddenInput />
                  <RadioGroup.ItemIndicator />
                  <RadioGroup.ItemText>{choice}</RadioGroup.ItemText>
                </RadioGroup.Item>
              ))}
            </Stack>
          </RadioGroup.Root>

          {feedback && (
            <Box
              mt="4"
              p="3"
              borderRadius="lg"
              bg={feedback.correct ? "green.50" : "red.50"}
              borderWidth="1px"
              borderColor={feedback.correct ? "green.200" : "red.200"}
            >
              <Text fontSize="sm" fontWeight="700" color={feedback.correct ? "green.700" : "red.700"}>
                {feedback.correct ? "正解です！" : "不正解です"}
              </Text>
              {!feedback.correct && (
                <Text fontSize="sm" color="gray.600" mt="1">
                  正解：{currentQuestion.choices[feedback.correctIndex]}
                </Text>
              )}
            </Box>
          )}

          <Stack direction="row" justify="flex-end" mt="5">
            {feedback === null ? (
              <Button className="bijyou-btn-cute" colorPalette="pink" onClick={handleSubmitAnswer} loading={submitting} disabled={selected === null}>
                回答する
              </Button>
            ) : (
              <Button className="bijyou-btn-cute" colorPalette="pink" onClick={handleNext}>
                {currentIndex + 1 < questions.length ? "次の問題へ" : "結果を見る ✨"}
              </Button>
            )}
          </Stack>
        </Box>
      )}

      {!loading && !error && finished && (
        <Box className="bijyou-card" bg="white" borderWidth="1px" borderColor="pink.100" borderRadius="xl" p="8" textAlign="center" boxShadow="sm">
          <Text fontSize="sm" color="gray.500" mb="2">
            お疲れさまでした 🎉
          </Text>
          <Heading className="font-display" fontSize="3xl" color="pink.700" mb="4">
            {score} / {questions.length} 問正解
          </Heading>
          <Button className="bijyou-btn-cute" colorPalette="pink" onClick={handleRestart}>
            もう一度挑戦する
          </Button>
        </Box>
      )}
    </Container>
  );
}
