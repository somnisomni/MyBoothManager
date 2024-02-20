import { createRouter, createWebHistory, type RouteRecordName, type RouteRecordRaw } from "vue-router";
import NotFoundErrorPage from "@/pages/NotFoundErrorPage.vue";
import PlaceholderPage from "@/pages/dev/PlaceholderPage.vue";
import BoothAdminRoot from "@/pages/BoothAdminRoot.vue";
import BoothAdminLayout from "@/pages/BoothAdminLayout.vue";
import BoothAdminInfoPage from "@/pages/subpages/BoothAdminInfoPage.vue";
import BoothAdminDashboardPage from "@/pages/subpages/BoothAdminDashboardPage.vue";
import BoothAdminGoodsPage from "@/pages/subpages/BoothAdminGoodsPage.vue";
import BoothAdminGoodsOrdersRootPage from "@/pages/subpages/orders/BoothAdminGoodsOrdersRootPage.vue";
import BoothAdminGoodsOrdersListPage from "@/pages/subpages/orders/BoothAdminGoodsOrdersListPage.vue";
import BoothAdminGoodsOrderDetailPage from "@/pages/subpages/orders/BoothAdminGoodsOrderDetailPage.vue";
import LogoutPage from "@/pages/LogoutPage.vue";
import { useAdminStore } from "@/stores/admin";
import { useAuthStore } from "@/stores/auth";

const isProd: boolean = import.meta.env.PROD;
const placeholderRoute: RouteRecordRaw = {
  path: "/:pathMatch(.*)*",
  name: "placeholder",
  component: PlaceholderPage,
};

/* Router definitions */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...(isProd ? [] : [placeholderRoute]),
    {
      path: isProd ? "/:pathMatch(.*)*" : "/404",
      name: "404",
      component: NotFoundErrorPage,
    },

    /* Login / Logout */
    {
      path: "/login",
      name: "login",
      component: () => import("@/pages/LoginPage.vue"),
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
      component: () => import("@/pages/superadmin/SuperAdminPage.vue"),
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
              path: "info",
              name: "admin-info",
              component: BoothAdminInfoPage,
            },
            {
              path: "goods",
              name: "admin-goods",
              component: BoothAdminGoodsPage,
            },
            {
              path: "orders",
              name: "admin-orders-root",
              component: BoothAdminGoodsOrdersRootPage,
              children: [
                {
                  path: "",
                  name: "admin-orders",
                  component: BoothAdminGoodsOrdersListPage,
                },
                {
                  path: ":id",
                  name: "admin-order-detail",
                  component: BoothAdminGoodsOrderDetailPage,
                },
              ],
            },
            {
              path: "analytics",
              name: "admin-analytics",
              component: () => import("@/pages/subpages/BoothAdminAnalyticsPage.vue"),
            },
            {
              path: "utility/price-calculator",
              name: "admin-utility-price-calculator",
              component: PlaceholderPage,
            },
          ],
        },
        {
          path: "/pos",
          name: "admin-pos",
          component: () => import("@/pages/subpages/BoothPOSPage.vue"),
        },
      ],
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if(savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

/* Router global hooks */
// Auth route guard
router.beforeEach((to, from, next) => {
  const isTokenAvailable = !!useAuthStore().isAuthTokenValid;
  // const isAccountDataAvailable = !!useAdminStore().currentAccount;
  const isAllAvailable = isTokenAvailable; /* && isAccountDataAvailable; */

  // SuperAdmin
  if(isAllAvailable
     && useAdminStore().currentAccount?.superAdmin
     && !((["superadmin", "logout"] as RouteRecordName[]).includes(to.name!))) {
    next({ name: "superadmin" });
    return;
  } else if(isAllAvailable
            && !useAdminStore().currentAccount?.superAdmin
            && to.name === "superadmin") {
    next({ name: "admin" });
    return;
  }

  // Normal
  if(isAllAvailable && to.name === "login") {
    next({ name: "admin" });
  } else if(!isAllAvailable && to.name !== "login") {
    next({ name: "login" });
  } else {
    next();
  }
});

export default router;
