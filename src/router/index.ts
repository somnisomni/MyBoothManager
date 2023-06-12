import { createRouter, createWebHistory } from "vue-router";
import PlaceholderPage from "@/pages/PlaceholderPage.vue";
import BoothViewPage from "@/pages/user/BoothViewPage.vue";
import BoothAdminRoot from "@/pages/admin/BoothAdminRoot.vue";
import BoothAdminDashboardPage from "@/pages/admin/BoothAdminDashboardPage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: PlaceholderPage,
    },

    /* User Routes */
    {
      path: "/booth/:id",
      name: "booth-indiv-view",
      component: BoothViewPage,
    },

    /* Admin Routes */
    {
      path: "/admin",
      name: "admin-root",
      component: BoothAdminRoot,
      children: [
        {
          path: "",
          name: "admin",
          component: BoothAdminDashboardPage,
        },
        {
          path: "analytics",
          name: "admin-analytics",
          component: PlaceholderPage,
        },
        {
          path: "goods",
          name: "admin-goods",
          component: PlaceholderPage,
        },
      ],
    },
  ],
});

export default router;
