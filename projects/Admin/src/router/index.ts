import { createRouter, createWebHistory } from "vue-router";
import ErrorPage from "@/pages/ErrorPage.vue";
import PlaceholderPage from "@/pages/dev/PlaceholderPage.vue";
import BoothAdminRoot from "@/pages/BoothAdminRoot.vue";
import BoothAdminLayout from "@/pages/BoothAdminLayout.vue";
import BoothAdminDashboardPage from "@/pages/subpages/BoothAdminDashboardPage.vue";
import BoothAdminGoodsPage from "@/pages/subpages/BoothAdminGoodsPage.vue";
import LoginPage from "@/pages/LoginPage.vue";
import LogoutPage from "@/pages/LogoutPage.vue";
import SuperAdminPage from "@/pages/superadmin/SuperAdminPage.vue";

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

    /* Login / Logout */
    {
      path: "/login",
      name: "login",
      component: LoginPage,
    },
    {
      path: "/logout",
      name: "logout",
      component: LogoutPage,
    },

    /* Super Admin */
    {
      path: "/superadmin",
      name: "superadmin",
      component: SuperAdminPage,
    },

    /* Admin Routes */
    {
      path: "/",
      name: "admin-root",
      component: BoothAdminRoot,
      children: [
        {
          path: "",
          name: "admin-layout",
          component: BoothAdminLayout,
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
      ],
    },
    {
      path: "/pos",
      name: "admin-pos",
      component: PlaceholderPage,
    },
  ],
});

export default router;
