import { createRouter, createWebHistory } from "vue-router";
import PlaceholderPage from "@/pages/PlaceholderPage.vue";
import BoothViewPage from "@/pages/user/BoothViewPage.vue";
import BoothAdminPage from "@/pages/admin/BoothAdminPage.vue";

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
      children: [
        {
          path: "",
          name: "admin",
          component: BoothAdminPage,
        },
      ],
    },
  ],
});

export default router;
