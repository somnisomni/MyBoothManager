import { createRouter, createWebHistory } from "vue-router";

/* Routes (lazy-loaded using Webpack code splitting) */
const NotFoundErrorPage = () => import(/* webpackChunkName: "pages/fundamentals" */ "@/pages/NotFoundErrorPage.vue");

const LandingPage = () => import(/* webpackChunkName: "pages/main", webpackPrefetch: true */ "@/pages/LandingPage.vue");

const IndividualBoothPage = () => import(/* webpackChunkName: "pages/booth" */ "@/pages/booth/IndividualBoothPage.vue");
/* === */

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
