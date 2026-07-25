export const ANALYTICS_EVENTS = Object.freeze({
  featuredAlbumListSelect: 'select_featured_album_list',
  navigationClick: 'navigation_click',
  contentSelect: 'select_content',
  searchSubmit: 'search_submit',
  searchResultsLoaded: 'search_results_loaded',
  itemListView: 'view_item_list',
  itemSelect: 'select_item',
  itemView: 'view_item',
  chartFilter: 'filter_album_list',
  listExpand: 'load_more',
  authStart: 'auth_start',
  authComplete: 'login',
  authError: 'auth_error',
  logout: 'logout',
  reviewSubmit: 'review_submit',
  profileTabSelect: 'select_profile_tab',
  contactIntent: 'contact_intent',
  exception: 'exception',
});

const sentOnceKeys = new Set();

const compactParameters = (parameters) =>
  Object.fromEntries(
    Object.entries(parameters).filter(
      ([, value]) => value !== undefined && value !== null && value !== '',
    ),
  );

const getPagePath = (browserWindow) => browserWindow?.location?.pathname ?? '';

const getLengthBucket = (length) => {
  if (length <= 0) return '0';
  if (length <= 3) return '1_3';
  if (length <= 10) return '4_10';
  return '11_plus';
};

const getResultCountBucket = (count) => {
  if (count <= 0) return '0';
  if (count <= 5) return '1_5';
  if (count <= 20) return '6_20';
  return '21_plus';
};

const getRatingBand = (rating) => {
  if (rating < 40) return 'low';
  if (rating < 70) return 'mid';
  if (rating < 90) return 'high';
  return 'top';
};

const toGaItem = (item, index) =>
  compactParameters({
    item_id: String(item.id),
    item_name: item.title,
    item_brand: item.artist,
    item_category: item.genre,
    index,
  });

export const trackEvent = (
  eventName,
  parameters = {},
  browserWindow = globalThis.window,
) => {
  if (typeof browserWindow?.gtag !== 'function') {
    return false;
  }

  browserWindow.gtag(
    'event',
    eventName,
    compactParameters({
      ...parameters,
      page_path: parameters.page_path ?? getPagePath(browserWindow),
    }),
  );
  return true;
};

export const trackEventOnce = (
  onceKey,
  eventName,
  parameters = {},
  browserWindow = globalThis.window,
) => {
  if (sentOnceKeys.has(onceKey)) {
    return false;
  }

  const sent = trackEvent(eventName, parameters, browserWindow);
  if (sent) sentOnceKeys.add(onceKey);
  return sent;
};

export const trackFeaturedAlbumListSelection = (browserWindow = globalThis.window) =>
  trackEvent(
    ANALYTICS_EVENTS.featuredAlbumListSelect,
    {
      button_id: 'home-featured-album-list',
      component: 'Home',
      page_section: 'featured-album-hero',
      interaction_type: 'cta_click',
      destination_path: '/best-albums',
    },
    browserWindow,
  );

export const trackNavigation = (
  { destinationPath, linkId, navigationArea },
  browserWindow = globalThis.window,
) =>
  trackEvent(
    ANALYTICS_EVENTS.navigationClick,
    {
      destination_path: destinationPath,
      link_id: linkId,
      navigation_area: navigationArea,
      component: 'Navbar',
      page_section: 'global-navigation',
      interaction_type: 'link_click',
    },
    browserWindow,
  );

export const trackContentSelection = (
  { contentType, contentId, destinationPath, component, pageSection },
  browserWindow = globalThis.window,
) =>
  trackEvent(
    ANALYTICS_EVENTS.contentSelect,
    {
      content_type: contentType,
      content_id: contentId,
      destination_path: destinationPath,
      component,
      page_section: pageSection,
      interaction_type: 'content_select',
    },
    browserWindow,
  );

export const trackSearchSubmit = (
  { queryLength, searchSource },
  browserWindow = globalThis.window,
) =>
  trackEvent(
    ANALYTICS_EVENTS.searchSubmit,
    {
      query_length_bucket: getLengthBucket(queryLength),
      search_source: searchSource,
      component: 'Navbar',
      page_section: 'global-search',
      interaction_type: 'form_submit',
    },
    browserWindow,
  );

export const trackSearchResultsLoaded = (
  { queryLength, resultCount, navigationKey },
  browserWindow = globalThis.window,
) =>
  trackEventOnce(
    `search_results:${navigationKey}:${getLengthBucket(queryLength)}`,
    ANALYTICS_EVENTS.searchResultsLoaded,
    {
      query_length_bucket: getLengthBucket(queryLength),
      result_count_bucket: getResultCountBucket(resultCount),
      result_state: resultCount > 0 ? 'has_results' : 'no_results',
      component: 'Search',
      page_section: 'search-results',
    },
    browserWindow,
  );

export const trackItemListView = (
  { itemListId, itemListName, items, navigationKey, component },
  browserWindow = globalThis.window,
) => {
  if (!Array.isArray(items) || items.length === 0) {
    return false;
  }

  return trackEventOnce(
    `view_item_list:${navigationKey}:${itemListId}`,
    ANALYTICS_EVENTS.itemListView,
    {
      item_list_id: itemListId,
      item_list_name: itemListName,
      items: items.slice(0, 25).map((item, index) => toGaItem(item, index)),
      component,
      page_section: itemListId,
    },
    browserWindow,
  );
};

export const trackAlbumSelect = (
  { albumId, albumTitle, artist, genre, itemListId, itemListName, index },
  browserWindow = globalThis.window,
) =>
  trackEvent(
    ANALYTICS_EVENTS.itemSelect,
    {
      item_list_id: itemListId,
      item_list_name: itemListName,
      items: [
        toGaItem(
          { id: albumId, title: albumTitle, artist, genre },
          index,
        ),
      ],
      component: 'AlbumCard',
      page_section: itemListId,
      interaction_type: 'album_select',
    },
    browserWindow,
  );

export const trackAlbumView = (
  { albumId, albumTitle, artist, genre, navigationKey },
  browserWindow = globalThis.window,
) =>
  trackEventOnce(
    `view_item:${navigationKey}:${albumId}`,
    ANALYTICS_EVENTS.itemView,
    {
      items: [toGaItem({ id: albumId, title: albumTitle, artist, genre }, 0)],
      component: 'AlbumDetail',
      page_section: 'album-detail',
    },
    browserWindow,
  );

export const trackChartFilter = (
  { filterName, filterValue, resultCount },
  browserWindow = globalThis.window,
) =>
  trackEvent(
    ANALYTICS_EVENTS.chartFilter,
    {
      filter_name: filterName,
      filter_value: filterValue,
      result_count_bucket: getResultCountBucket(resultCount),
      component: 'BestAlbums',
      page_section: 'chart-toolbar',
      interaction_type: filterName === 'reset' ? 'filter_reset' : 'filter_apply',
    },
    browserWindow,
  );

export const trackListExpansion = (
  { listId, visibleCount, remainingCount, component },
  browserWindow = globalThis.window,
) =>
  trackEvent(
    ANALYTICS_EVENTS.listExpand,
    {
      list_id: listId,
      visible_count_bucket: getResultCountBucket(visibleCount),
      remaining_count_bucket: getResultCountBucket(remainingCount),
      component,
      page_section: listId,
      interaction_type: 'list_expand',
    },
    browserWindow,
  );

export const trackAuthStart = (
  { authFlow, method },
  browserWindow = globalThis.window,
) =>
  trackEvent(
    ANALYTICS_EVENTS.authStart,
    {
      auth_flow: authFlow,
      method,
      component: authFlow === 'signup' ? 'SignUp' : 'Login',
      page_section: 'authentication-form',
      interaction_type: 'auth_start',
    },
    browserWindow,
  );

export const trackAuthSuccess = (
  { authFlow, method },
  browserWindow = globalThis.window,
) =>
  trackEvent(
    ANALYTICS_EVENTS.authComplete,
    {
      auth_flow: authFlow,
      method,
      component: 'AuthProvider',
      page_section: 'authentication',
    },
    browserWindow,
  );

export const trackAuthError = (
  { authFlow, method, errorType },
  browserWindow = globalThis.window,
) =>
  trackEvent(
    ANALYTICS_EVENTS.authError,
    {
      auth_flow: authFlow,
      method,
      error_type: errorType,
      component: 'AuthProvider',
      page_section: 'authentication',
    },
    browserWindow,
  );

export const trackLogout = (browserWindow = globalThis.window) =>
  trackEvent(
    ANALYTICS_EVENTS.logout,
    {
      component: 'Navbar',
      page_section: 'profile-menu',
      interaction_type: 'logout',
    },
    browserWindow,
  );

export const trackReviewSubmit = (
  { albumId, rating, reviewLength },
  browserWindow = globalThis.window,
) =>
  trackEvent(
    ANALYTICS_EVENTS.reviewSubmit,
    {
      item_id: String(albumId),
      rating_band: getRatingBand(rating),
      review_length_bucket: getLengthBucket(reviewLength),
      component: 'AlbumDetail',
      page_section: 'review-form',
      interaction_type: 'review_submit',
    },
    browserWindow,
  );

export const trackProfileTab = (
  { tabName, profileScope, component },
  browserWindow = globalThis.window,
) =>
  trackEvent(
    ANALYTICS_EVENTS.profileTabSelect,
    {
      tab_name: tabName,
      profile_scope: profileScope,
      component,
      page_section: 'profile-tabs',
      interaction_type: 'tab_select',
    },
    browserWindow,
  );

export const trackContactIntent = (browserWindow = globalThis.window) =>
  trackEvent(
    ANALYTICS_EVENTS.contactIntent,
    {
      contact_channel: 'email',
      button_id: 'contact-support-email',
      component: 'Contact',
      page_section: 'contact-card',
      interaction_type: 'mailto_click',
    },
    browserWindow,
  );

export const trackException = (
  errorType,
  fatal = true,
  browserWindow = globalThis.window,
) =>
  trackEvent(
    ANALYTICS_EVENTS.exception,
    {
      description: errorType,
      fatal,
      error_type: errorType,
      component: 'ErrorBoundary',
      page_section: 'application-shell',
    },
    browserWindow,
  );

export const resetAnalyticsStateForTests = () => sentOnceKeys.clear();
