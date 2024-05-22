import { createRouter, createWebHistory, type RouteRecordName, type RouteRecordRaw } from "vue-router";
import { useAdminStore } from "@/plugins/stores/admin";
import { useAuthLocalStore, useAuthStore } from "@/plugins/stores/auth";

/* Routes (lazy-loaded using Webpack code splitting) */
const NotFoundErrorPage = () => import(/* webpackChunkName: "pages/fundamentals" */ "@/pages/NotFoundErrorPage.vue");
const LogoutPage        = () => import(/* webpackChunkName: "pages/fundamentals", webpackPrefetch: true */ "@/pages/LogoutPage.vue");
const LoginPage         = () => import(/* webpackChunkName: "pages/fundamentals", webpackPrefetch: true */ "@/pages/LoginPage.vue");

const PlaceholderPage = () => import(/* webpackChunkName: "pages/extras" */ "@/pages/dev/PlaceholderPage.vue");
const SuperAdminPage  = () => import(/* webpackChunkName: "pages/extras" */ "@/pages/superadmin/SuperAdminPage.vue");

const BoothAdminRoot          = () => import(/* webpackChunkName: "pages/admin-booth" */ "@/pages/BoothAdminRoot.vue");
const BoothAdminLayout        = () => import(/* webpackChunkName: "pages/admin-booth" */ "@/pages/BoothAdminLayout.vue");
const BoothPOSPage            = () => import(/* webpackChunkName: "pages/admin-booth" */ "@/pages/subpages/BoothPOSPage.vue");
const BoothAdminInfoPage      = () => import(/* webpackChunkName: "pages/admin-booth" */ "@/pages/subpages/BoothAdminInfoPage.vue");
const BoothAdminDashboardPage = () => import(/* webpackChunkName: "pages/admin-booth" */ "@/pages/subpages/BoothAdminDashboardPage.vue");
const BoothAdminAnalyticsPage = () => import(/* webpackChunkName: "pages/admin-booth" */ "@/pages/subpages/BoothAdminAnalyticsPage.vue");
const BoothAdminClosingPage   = () => import(/* webpackChunkName: "pages/admin-booth" */ "@/pages/subpages/BoothAdminClosingPage.vue");

const BoothAdminGoodsPage     = () => import(/* webpackChunkName: "pages/admin-goods" */ "@/pages/subpages/BoothAdminGoodsPage.vue");

const BoothAdminGoodsOrdersRootPage  = () => import(/* webpackChunkName: "pages/admin-goods-order" */ "@/pages/subpages/orders/BoothAdminGoodsOrdersRootPage.vue");
const BoothAdminGoodsOrdersListPage  = () => import(/* webpackChunkName: "pages/admin-goods-order" */ "@/pages/subpages/orders/BoothAdminGoodsOrdersListPage.vue");
const BoothAdminGoodsOrderDetailPage = () => import(/* webpackChunkName: "pages/admin-goods-order" */ "@/pages/subpages/orders/BoothAdminGoodsOrderDetailPage.vue");
/* === */

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
              component: BoothAdminAnalyticsPage,
            },
            {
              path: "closing",
              name: "admin-closing",
              component: BoothAdminClosingPage,
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
          component: BoothPOSPage,
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
router.beforeEach(async (to, from, next) => {
  let authTokenAvailable = !!useAuthLocalStore().accessToken;
  const authIdAvailable = !!useAuthStore().id;

  // SuperAdmin
  if(authTokenAvailable
     && useAdminStore().currentAccount?.superAdmin
     && !((["superadmin", "logout"] as RouteRecordName[]).includes(to.name!))) {
    next({ name: "superadmin" });
    return;
  } else if(authTokenAvailable
            && !useAdminStore().currentAccount?.superAdmin
            && to.name === "superadmin") {
    next({ name: "admin" });
    return;
  }

  // Normal
  if(!authTokenAvailable && authIdAvailable) {
    try {
      await useAuthStore().adminAuthRefresh();
      authTokenAvailable = !!useAuthLocalStore().accessToken;
    } catch(err) {
      console.error(err);
      useAuthStore().invalidateLoginData();
    }
  }

  if(authTokenAvailable && to.name === "login") {
    next({ name: "admin" });
  } else if(!authTokenAvailable && to.name !== "login") {
    next({ name: "login", state: { noAccess: true } });
  } else {
    next();
  }
});

export default router;
