import { createRouter, createWebHistory, type RouteRecordName, type RouteRecordRaw } from "vue-router";
import { useAdminStore } from "@/plugins/stores/admin";
import { useAuthLocalStore, useAuthStore } from "@/plugins/stores/auth";

/* Routes (lazy-loaded using Webpack code splitting) */
const NotFoundErrorPage = () => import(/* webpackChunkName: "pages/fundamentals" */ "@/pages/NotFoundErrorPage.vue");
const LogoutPage        = () => import(/* webpackChunkName: "pages/fundamentals", webpackPrefetch: true */ "@/pages/LogoutPage.vue");
const LoginPage         = () => import(/* webpackChunkName: "pages/fundamentals", webpackPrefetch: true */ "@/pages/LoginPage.vue");

const PlaceholderPage = () => import(/* webpackChunkName: "pages/extras" */ "@/pages/dev/PlaceholderPage.vue");
const SuperAdminPage  = () => import(/* webpackChunkName: "pages/extras" */ "@/pages/superadmin/SuperAdminPage.vue");

const AdminRoot     = () => import(/* webpackChunkName: "pages/admin-booth" */ "@/pages/AdminRoot.vue");
const AdminLayout   = () => import(/* webpackChunkName: "pages/admin-booth" */ "@/pages/AdminLayout.vue");
const GoodsPage     = () => import(/* webpackChunkName: "pages/admin-booth" */ "@/pages/subpages/GoodsPage.vue");
const POSPage       = () => import(/* webpackChunkName: "pages/admin-booth" */ "@/pages/subpages/POSPage.vue");
const DashboardPage = () => import(/* webpackChunkName: "pages/admin-booth" */ "@/pages/subpages/DashboardPage.vue");
const AnalyticsPage = () => import(/* webpackChunkName: "pages/admin-booth" */ "@/pages/subpages/AnalyticsPage.vue");
const ClosingPage   = () => import(/* webpackChunkName: "pages/admin-booth" */ "@/pages/subpages/ClosingPage.vue");

const GoodsOrdersRootPage  = () => import(/* webpackChunkName: "pages/admin-goods-order" */ "@/pages/subpages/orders/GoodsOrderRootPage.vue");
const GoodsOrdersListPage  = () => import(/* webpackChunkName: "pages/admin-goods-order" */ "@/pages/subpages/orders/GoodsOrderListPage.vue");
const GoodsOrderDetailPage = () => import(/* webpackChunkName: "pages/admin-goods-order" */ "@/pages/subpages/orders/GoodsOrderDetailPage.vue");

const LegacyInfoPage      = () => import(/* webpackChunkName: "pages/admin-info" */ "@/pages/subpages/InfoPage.vue");
const InfoBannerImagePage = () => import(/* webpackChunkName: "pages/admin-info" */ "@/pages/subpages/info/InfoBannerImagePage.vue");
const InfoInfoImagePage   = () => import(/* webpackChunkName: "pages/admin-info" */ "@/pages/subpages/info/InfoInfoImagePage.vue");
const InfoInfoPage        = () => import(/* webpackChunkName: "pages/admin-info" */ "@/pages/subpages/info/InfoInfoPage.vue");
const InfoMemberPage      = () => import(/* webpackChunkName: "pages/admin-info" */ "@/pages/subpages/info/InfoMemberPage.vue");
const InfoNoticePage      = () => import(/* webpackChunkName: "pages/admin-info" */ "@/pages/subpages/info/InfoNoticePage.vue");

const HelpPage = () => import(/* webpackChunkName: "pages/support" */ "@/pages/support/help/HelpRootPage.vue");
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
      component: AdminRoot,
      children: [
        {
          path: "",
          name: "admin-layout",
          component: AdminLayout,
          children: [
            {
              path: "",
              name: "admin",
              component: DashboardPage,
            },
            {
              path: "info",
              name: "admin-info",
              component: LegacyInfoPage,
            },
            {
              path: "info",
              name: "admin-info-root",
              children: [
                {
                  path: "bannerimage",
                  name: "admin-info-banner-image",
                  component: InfoBannerImagePage,
                },
                {
                  path: "infoimage",
                  name: "admin-info-info-image",
                  component: InfoInfoImagePage,
                },
                {
                  path: "info",
                  name: "admin-info-info",
                  component: InfoInfoPage,
                },
                {
                  path: "member",
                  name: "admin-info-member",
                  component: InfoMemberPage,
                },
                {
                  path: "notice",
                  name: "admin-info-notice",
                  component: InfoNoticePage,
                },
              ],
            },
            {
              path: "goods",
              name: "admin-goods",
              component: GoodsPage,
            },
            {
              path: "orders",
              name: "admin-orders-root",
              component: GoodsOrdersRootPage,
              children: [
                {
                  path: "",
                  name: "admin-orders",
                  component: GoodsOrdersListPage,
                },
                {
                  path: ":id",
                  name: "admin-order-detail",
                  component: GoodsOrderDetailPage,
                },
              ],
            },
            {
              path: "analytics",
              name: "admin-analytics",
              component: AnalyticsPage,
            },
            {
              path: "closing",
              name: "admin-closing",
              component: ClosingPage,
            },
            {
              path: "utility/price-calculator",
              name: "admin-utility-price-calculator",
              component: PlaceholderPage,
            },
            {
              path: "support/help",
              name: "admin-support-help",
              component: HelpPage,
            },
            {
              path: "support/help/:name",
              name: "admin-support-help-individual",
              component: HelpPage,
            },
          ],
        },
        {
          path: "/pos",
          name: "admin-pos",
          component: POSPage,
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
    next({ name: "login", state: { noAccess: to.path !== "/" } });
  } else {
    next();
  }
});

export default router;
