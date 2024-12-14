<template>
  <CommonDialog v-model="open"
                dialogTitle="Markdown 문법 도움말"
                fullscreenOnSmallScreen>
    <p class="text-disabled text-subtitle-2">※ Markdown 문법에 대한 자세한 내용은 <a href="https://ko.wikipedia.org/wiki/%EB%A7%88%ED%81%AC%EB%8B%A4%EC%9A%B4" target="_blank">위키피디아 문서</a>를 참고해주세요. 모든 Markdown 문법이 작동하는 것은 아닙니다.</p>

    <div class="mt-6 px-2">
      <VSheet v-for="content in contents"
              :key="content.title"
              class="my-4 pa-4 elevation-4 rounded-lg">
        <h5 class="text-h5 font-weight-bold">{{ content.title }}</h5>
        <VDivider class="my-2" />
        <p>{{ content.description }}</p>

        <div class="mt-4">
          <p class="text-disabled text-subtitle-2">입력 예시:</p>
          <pre class="pa-2 rounded-lg bg-surface-light overflow-x-auto"><code>{{ content.example }}</code></pre>

          <p class="mt-4 text-disabled text-subtitle-2">표시 예시:</p>
          <MarkdownRenderer :source="content.example"
                            class="text-center pa-2" />
        </div>
      </VSheet>
    </div>
  </CommonDialog>
</template>

<script lang="ts">
import { Component, Model, toNative, Vue } from "vue-facing-decorator";

interface MarkdownHelpContent {
  title: string;
  description: string;
  example: string;
}

@Component({})
export class MarkdownHelpDialog extends Vue {
  @Model({ type: Boolean, default: false }) declare open: boolean;

  readonly contents: MarkdownHelpContent[] = [
    {
      title: "헤드라인",
      description: "제목 등을 표시할 때 사용합니다.",
      example: "# 제목 1\n## 제목 2\n### 제목 3",
    },
    {
      title: "글씨 스타일",
      description: "글씨를 꾸밀 때 사용합니다.",
      example: "**굵은 글씨**\n*기울임 글씨*\n~~취소선~~\n<u>밑줄</u>",
    },
    {
      title: "링크",
      description: "외부 웹사이트의 링크를 삽입할 때 사용합니다.",
      example: "[선입금 페이지](https://example.com)",
    },
    {
      title: "인용",
      description: "부연 설명이나 인용문 등을 작성할 때 사용합니다. 왼쪽 정렬되어 표시됩니다.",
      example: "> 특전은 1만원 이상 구매 시 증정합니다.",
    },
    {
      title: "목록",
      description: "여러 항목을 나열할 때 사용합니다. 왼쪽 정렬되어 표시됩니다.",
      example: "- 항목 1\n- 항목 2\n  - 하위 항목 1\n  - 하위 항목 2",
    },
    {
      title: "일부 HTML 태그",
      description: "일부 안전한 HTML 태그를 사용할 수 있습니다.",
      example: "<marquee>부우우우우우우우우스으으으으으으</marquee>\n<p align=\"left\">왼쪽 정렬</p>\n<p align=\"right\">오른쪽 정렬</p>\n"
        + "<table style=\"margin: auto\"><tr><th>제목 1</th><th>제목 2</th></tr><tr><td>내용 1</td><td>내용 2</td></tr></table>",
    },
  ];
}

export default toNative(MarkdownHelpDialog);
</script>
