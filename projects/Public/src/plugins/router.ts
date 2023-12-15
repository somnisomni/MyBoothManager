import { createRouter, createWebHistory } from "vue-router";
import NotFoundErrorPage from "@/pages/NotFoundErrorPage.vue";
import LandingPage from "@/pages/LandingPage.vue";
import IndividualBoothPage from "@/pages/booth/IndividualBoothPage.vue";

/* Router definitions */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/:pathMatch(.*)*",
      name: "404",
      meta: { title: "404 | MyBoothManager" },
      component: NotFoundErrorPage,
    },

    {
      path: "/",
      name: "root",
      children: [
        {
          path: "",
          name: "landing",
          meta: { title: "MyBoothManager" },
          component: LandingPage,
        },
      ],
    },
    {
      path: "/booth/:boothId",
      name: "booth-individual",
      meta: { title: "부스 정보 | MyBoothManager" },
      component: IndividualBoothPage,
    },
  ],
});

router.afterEach((to) => {
  document.title = to.meta.title as string ?? "MyBoothManager";
});

export default router;
