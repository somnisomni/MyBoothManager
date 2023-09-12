import { createRouter, createWebHistory } from "vue-router";
import ErrorPage from "@/pages/ErrorPage.vue";
import PlaceholderPage from "@/pages/dev/PlaceholderPage.vue";
import BoothAdminRoot from "@/pages/BoothAdminRoot.vue";
import BoothAdminDashboardPage from "@/pages/BoothAdminDashboardPage.vue";
import BoothAdminGoodsPage from "@/pages/BoothAdminGoodsPage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    /* Falloff route */
    {
      path: "/:pathMatch(.*)*",
      name: "placeholder",
      component: PlaceholderPage,
    },
    {
      path: "/404",  // Change this to "/:pathMatch(.*)*" later, on real production
      name: "404",
      component: ErrorPage,
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
          path: "goods",
          name: "admin-goods",
          component: BoothAdminGoodsPage,
        },
        {
          path: "analytics",
          name: "admin-analytics",
          component: PlaceholderPage,
        },
        {
          path: "utility/price-calculator",
          name: "admin-utility-price-calculator",
          component: PlaceholderPage,
        },
      ],
    },
    {
      path: "/storemode",
      name: "admin-storemode",
      component: PlaceholderPage,
    }
  ],
});

export default router;
