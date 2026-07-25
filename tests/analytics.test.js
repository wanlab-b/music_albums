import assert from 'node:assert/strict';
import test from 'node:test';

import {
  ANALYTICS_EVENTS,
  resetAnalyticsStateForTests,
  trackAlbumSelect,
  trackAlbumView,
  trackAuthError,
  trackAuthStart,
  trackAuthSuccess,
  trackChartFilter,
  trackContactIntent,
  trackContentSelection,
  trackEvent,
  trackFeaturedAlbumListSelection,
  trackItemListView,
  trackListExpansion,
  trackLogout,
  trackNavigation,
  trackProfileTab,
  trackReviewSubmit,
  trackSearchResultsLoaded,
  trackSearchSubmit,
} from '../src/analytics.js';

const createBrowserWindow = (pathname = '/') => {
  const calls = [];
  return {
    calls,
    browserWindow: {
      gtag: (...args) => calls.push(args),
      location: { pathname },
    },
  };
};

test.beforeEach(() => resetAnalyticsStateForTests());

test('loading the analytics module does not emit an event', async () => {
  const calls = [];
  const previousWindow = globalThis.window;
  globalThis.window = {
    gtag: (...args) => calls.push(args),
    location: { pathname: '/' },
  };

  try {
    await import('../src/analytics.js?module-load-check-broad');
    assert.equal(calls.length, 0);
  } finally {
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
  }
});

test('tracking is a safe no-op when gtag is unavailable', () => {
  assert.equal(trackEvent('test_event', {}, { location: { pathname: '/' } }), false);
});

test('generic tracking adds page context and removes empty parameters', () => {
  const { calls, browserWindow } = createBrowserWindow('/discover');
  trackEvent('test_event', { component: 'Test', empty: '', missing: undefined }, browserWindow);
  assert.deepEqual(calls, [
    ['event', 'test_event', { component: 'Test', page_path: '/discover' }],
  ]);
});

test('featured CTA emits one stable event with its destination', () => {
  const { calls, browserWindow } = createBrowserWindow('/');
  assert.equal(trackFeaturedAlbumListSelection(browserWindow), true);
  assert.equal(calls.length, 1);
  assert.equal(calls[0][1], ANALYTICS_EVENTS.featuredAlbumListSelect);
  assert.equal(calls[0][2].destination_path, '/best-albums');
});

test('search submit never sends the raw query', () => {
  const { calls, browserWindow } = createBrowserWindow('/');
  trackSearchSubmit({ queryLength: 12, searchSource: 'desktop_nav' }, browserWindow);
  assert.equal(calls.length, 1);
  assert.equal(calls[0][1], ANALYTICS_EVENTS.searchSubmit);
  assert.equal(calls[0][2].query_length_bucket, '11_plus');
  assert.equal('search_term' in calls[0][2], false);
});

test('search result loading dedupes the same navigation key', () => {
  const { calls, browserWindow } = createBrowserWindow('/search');
  const input = { queryLength: 4, resultCount: 0, navigationKey: 'nav-1' };
  assert.equal(trackSearchResultsLoaded(input, browserWindow), true);
  assert.equal(trackSearchResultsLoaded(input, browserWindow), false);
  assert.equal(calls.length, 1);
  assert.equal(calls[0][2].result_state, 'no_results');
});

test('item list views dedupe StrictMode but allow a new navigation', () => {
  const { calls, browserWindow } = createBrowserWindow('/');
  const base = {
    itemListId: 'home_trending',
    itemListName: 'Home Trending',
    items: [{ id: 'album-1', title: 'Album', artist: 'Artist', genre: 'Pop' }],
    component: 'Home',
  };
  assert.equal(trackItemListView({ ...base, navigationKey: 'a' }, browserWindow), true);
  assert.equal(trackItemListView({ ...base, navigationKey: 'a' }, browserWindow), false);
  assert.equal(trackItemListView({ ...base, navigationKey: 'b' }, browserWindow), true);
  assert.equal(calls.length, 2);
});

test('album select uses GA4 item payload without user data', () => {
  const { calls, browserWindow } = createBrowserWindow('/discover');
  trackAlbumSelect(
    {
      albumId: 'album-7',
      albumTitle: 'Public Album',
      artist: 'Public Artist',
      genre: 'Indie',
      itemListId: 'discover_popular',
      itemListName: 'Discover Popular',
      index: 2,
    },
    browserWindow,
  );
  assert.equal(calls[0][1], ANALYTICS_EVENTS.itemSelect);
  assert.deepEqual(calls[0][2].items[0], {
    item_id: 'album-7',
    item_name: 'Public Album',
    item_brand: 'Public Artist',
    item_category: 'Indie',
    index: 2,
  });
});

test('album view dedupes StrictMode by navigation key', () => {
  const { calls, browserWindow } = createBrowserWindow('/album/7');
  const input = {
    albumId: '7',
    albumTitle: 'Album',
    artist: 'Artist',
    genre: 'Rock',
    navigationKey: 'album-nav',
  };
  assert.equal(trackAlbumView(input, browserWindow), true);
  assert.equal(trackAlbumView(input, browserWindow), false);
  assert.equal(calls.length, 1);
  assert.equal(calls[0][1], ANALYTICS_EVENTS.itemView);
});

test('Google auth success reports login and no identity fields', () => {
  const { calls, browserWindow } = createBrowserWindow('/login');
  trackAuthSuccess({ authFlow: 'login', method: 'google' }, browserWindow);
  assert.equal(calls[0][1], 'login');
  assert.deepEqual(calls[0][2], {
    auth_flow: 'login',
    method: 'google',
    component: 'AuthProvider',
    page_section: 'authentication',
    page_path: '/login',
  });
});

test('review success sends only safe buckets, never review content', () => {
  const { calls, browserWindow } = createBrowserWindow('/album/9');
  trackReviewSubmit({ albumId: '9', rating: 88, reviewLength: 120 }, browserWindow);
  assert.equal(calls[0][1], ANALYTICS_EVENTS.reviewSubmit);
  assert.equal(calls[0][2].rating_band, 'high');
  assert.equal(calls[0][2].review_length_bucket, '11_plus');
  assert.equal('content' in calls[0][2], false);
  assert.equal('username' in calls[0][2], false);
});

test('contact intent emits exactly one email CTA event', () => {
  const { calls, browserWindow } = createBrowserWindow('/contact');
  trackContactIntent(browserWindow);
  assert.equal(calls.length, 1);
  assert.equal(calls[0][1], ANALYTICS_EVENTS.contactIntent);
  assert.equal(calls[0][2].button_id, 'contact-support-email');
});

test('empty item lists are not reported as impressions', () => {
  const { calls, browserWindow } = createBrowserWindow('/');
  assert.equal(trackItemListView({
    itemListId: 'home_trending',
    itemListName: 'Home Trending',
    items: [],
    navigationKey: 'empty-nav',
    component: 'Home',
  }, browserWindow), false);
  assert.equal(calls.length, 0);
});

test('navigation and content selection use stable destinations', () => {
  const { calls, browserWindow } = createBrowserWindow('/');
  trackNavigation({
    destinationPath: '/discover',
    linkId: 'primary-discover',
    navigationArea: 'desktop_primary',
  }, browserWindow);
  trackContentSelection({
    contentType: 'album_list',
    contentId: 'home_trending',
    destinationPath: '/discover',
    component: 'Home',
    pageSection: 'home_trending',
  }, browserWindow);
  assert.deepEqual(calls.map((call) => call[1]), [
    ANALYTICS_EVENTS.navigationClick,
    ANALYTICS_EVENTS.contentSelect,
  ]);
  assert.equal(calls[0][2].destination_path, '/discover');
  assert.equal(calls[1][2].content_id, 'home_trending');
});

test('chart filters and list expansion report bucketed metadata', () => {
  const { calls, browserWindow } = createBrowserWindow('/best-albums');
  trackChartFilter({ filterName: 'genre', filterValue: 'rock', resultCount: 13 }, browserWindow);
  trackListExpansion({
    listId: 'best_albums_chart',
    visibleCount: 20,
    remainingCount: 7,
    component: 'BestAlbums',
  }, browserWindow);
  assert.equal(calls[0][1], ANALYTICS_EVENTS.chartFilter);
  assert.equal(calls[0][2].result_count_bucket, '6_20');
  assert.equal(calls[1][1], ANALYTICS_EVENTS.listExpand);
  assert.equal(calls[1][2].remaining_count_bucket, '6_20');
});

test('authentication lifecycle never includes identity fields', () => {
  const { calls, browserWindow } = createBrowserWindow('/signup');
  trackAuthStart({ authFlow: 'signup', method: 'google' }, browserWindow);
  trackAuthError({ authFlow: 'signup', method: 'google', errorType: 'oauth_error' }, browserWindow);
  trackLogout(browserWindow);
  assert.deepEqual(calls.map((call) => call[1]), [
    ANALYTICS_EVENTS.authStart,
    ANALYTICS_EVENTS.authError,
    ANALYTICS_EVENTS.logout,
  ]);
  for (const [, , parameters] of calls) {
    assert.equal('email' in parameters, false);
    assert.equal('user_name' in parameters, false);
  }
});

test('profile tabs send only the selected tab and scope', () => {
  const { calls, browserWindow } = createBrowserWindow('/mypage');
  trackProfileTab({ tabName: 'reviews', profileScope: 'self', component: 'MyPage' }, browserWindow);
  assert.equal(calls[0][1], ANALYTICS_EVENTS.profileTabSelect);
  assert.equal(calls[0][2].tab_name, 'reviews');
  assert.equal(calls[0][2].profile_scope, 'self');
});