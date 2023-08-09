import { createRouter, createWebHistory } from "vue-router";
import PlaceholderPage from "@/pages/dev/PlaceholderPage.vue";
import BoothAdminRoot from "@/pages/BoothAdminRoot.vue";
import BoothAdminDashboardPage from "@/pages/BoothAdminDashboardPage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    /* Falloff route */
    {
      path: "*",
      name: "placeholder",
      component: PlaceholderPage,
    },

    /* Admin Routes */
    {
      path: "/",
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
