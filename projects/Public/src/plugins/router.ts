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
      component: NotFoundErrorPage,
    },

    {
      path: "/",
      name: "root",
      children: [
        {
          path: "",
          name: "landing",
          component: LandingPage,
        },
      ],
    },
    {
      path: "/booth/:boothId",
      name: "booth-individual",
      component: IndividualBoothPage,
    },
  ],
});

export default router;
