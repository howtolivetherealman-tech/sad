import test from 'node:test';
import assert from 'node:assert/strict';
import { INITIAL_STORE_DATA } from './initial-data';
import {
  verifyAdminPassword,
  extractYouTubeVideoId,
  sortVideosNewestFirst,
  addYouTubeVideoToStore,
  filterOutNonChannelDemoVideos,
  updateLogoInStore,
  addServiceToStore,
  updateServiceInStore,
  removeServiceFromStore,
  addProductToStore,
  updateProductInStore,
  addHerbToStore,
  updateHerbInStore,
  removeHerbFromStore,
  addPreparationToStore,
  updatePreparationInStore,
  removePreparationFromStore,
  submitPrivateAdToStore,
  updatePrivateAdStatusInStore,
} from './store-logic';

test('verifyAdminPassword validates 1977 accurately', () => {
  assert.equal(verifyAdminPassword('1977'), true);
  assert.equal(verifyAdminPassword(' 1977 '), true);
  assert.equal(verifyAdminPassword('1978'), false);
  assert.equal(verifyAdminPassword('admin'), false);
});

test('initial videos only contain real Sadguru Naatu Vaidyam channel videos', () => {
  const videoIds = INITIAL_STORE_DATA.videos.map((v) => v.videoId);
  assert.equal(videoIds.includes('Vn_y9SOt3OU'), true);
  assert.equal(videoIds.includes('4ekOKTbc9g4'), true);
  assert.equal(videoIds.includes('M7lc1UVf-VE'), false);
  assert.equal(videoIds.includes('ysz5S6PUM-U'), false);
  assert.equal(videoIds.includes('jNQXAC9IVRw'), false);

  const cleaned = filterOutNonChannelDemoVideos(
    [
      ...INITIAL_STORE_DATA.videos,
      {
        id: 'old-1',
        videoId: 'M7lc1UVf-VE',
        url: 'https://www.youtube.com/watch?v=M7lc1UVf-VE',
        title: { te: 'old', en: 'old' },
        description: { te: 'old', en: 'old' },
        addedAt: 100,
      },
    ],
    INITIAL_STORE_DATA.videos
  );
  assert.equal(
    cleaned.some((v) => v.videoId === 'M7lc1UVf-VE'),
    false
  );
});

test('extractYouTubeVideoId parses watch, youtu.be, shorts, embed, and raw IDs', () => {
  assert.equal(
    extractYouTubeVideoId('https://www.youtube.com/watch?v=Vn_y9SOt3OU'),
    'Vn_y9SOt3OU'
  );
  assert.equal(
    extractYouTubeVideoId('https://youtu.be/4ekOKTbc9g4?si=12345'),
    '4ekOKTbc9g4'
  );
  assert.equal(
    extractYouTubeVideoId('https://www.youtube.com/shorts/ZP52nC0H7xg'),
    'ZP52nC0H7xg'
  );
  assert.equal(extractYouTubeVideoId('not-a-valid-link'), null);
});

test('addYouTubeVideoToStore places newly uploaded video 1st in list', () => {
  const result = addYouTubeVideoToStore(INITIAL_STORE_DATA, {
    url: 'https://youtu.be/c9F8KgizO34',
    titleTe: 'కొత్తగా అప్లోడ్ చేసిన వీడియో',
    titleEn: 'Newly Uploaded First Video',
  });

  assert.equal(result.error, undefined);
  assert.equal(result.store.videos[0].videoId, 'c9F8KgizO34');
  assert.equal(result.store.videos[0].title.te, 'కొత్తగా అప్లోడ్ చేసిన వీడియో');

  const sorted = sortVideosNewestFirst(result.store.videos);
  assert.equal(sorted[0].videoId, 'c9F8KgizO34');
});

test('updateLogoInStore updates website logo and googleAds includes AdSense ca-pub-6709151112965859', () => {
  const customLogo = 'data:image/png;base64,customLogo123';
  const updated = updateLogoInStore(INITIAL_STORE_DATA, customLogo);
  assert.equal(updated.logoUrl, customLogo);
  assert.equal(
    INITIAL_STORE_DATA.googleAds.adsenseClientId,
    'ca-pub-6709151112965859'
  );
  assert.equal(
    INITIAL_STORE_DATA.googleAds.adScriptOrCode.includes(
      'ca-pub-6709151112965859'
    ),
    true
  );
});

test('services, products, herbs, and preparations support full CRUD and image uploads', () => {
  // 1. సమస్యలు & పరిష్కారాలు (Services with image upload)
  const sAdded = addServiceToStore(INITIAL_STORE_DATA, {
    category: 'tantra',
    titleTe: 'గృహ దిగ్బంధన రక్షణ పూజ',
    descriptionTe: 'ఇంటికి నలువైపులా తాంత్రిక రక్షణ ఏర్పాటు చేయుట.',
    imageUrl: 'data:image/svg+xml;utf8,<svg id="srv"></svg>',
  });
  const lastSrv = sAdded.services[sAdded.services.length - 1];
  assert.equal(lastSrv.imageUrl, 'data:image/svg+xml;utf8,<svg id="srv"></svg>');

  const sEdited = updateServiceInStore(sAdded, {
    ...lastSrv,
    title: { te: 'గృహ రక్షణ పూజ (Edited)', en: 'Home Protection Puja' },
  });
  assert.equal(
    sEdited.services[sEdited.services.length - 1].title.te,
    'గృహ రక్షణ పూజ (Edited)'
  );
  const sRemoved = removeServiceFromStore(sEdited, lastSrv.id);
  assert.equal(sRemoved.services.length, INITIAL_STORE_DATA.services.length);

  // 2. యంత్రములు & పూజ (Sacred Yantras & Puja)
  const pAdded = addProductToStore(INITIAL_STORE_DATA, {
    category: 'yantra',
    nameTe: 'శ్రీ మహా మృత్యుంజయ యంత్రం',
    descriptionTe: 'ఆరోగ్య రక్షణ యంత్రం.',
    price: 2200,
    imageUrl: 'data:image/svg+xml;utf8,<svg id="prod"></svg>',
  });
  const firstProd = pAdded.products[0];
  const pEdited = updateProductInStore(pAdded, {
    ...firstProd,
    price: 2600,
  });
  assert.equal(pEdited.products[0].price, 2600);

  // 3. మూలికలు & తయారీ (Herbs & Medicine Preparation)
  const hAdded = addHerbToStore(INITIAL_STORE_DATA, {
    nameTe: 'నల్ల ఉమ్మెత్త (Datura)',
    benefitsTe: 'తాంత్రిక మరియు బాహ్య నొప్పుల నివారణకు.',
    imageUrl: 'data:image/svg+xml;utf8,<svg id="herb"></svg>',
  });
  const firstHerb = hAdded.herbs[0];
  assert.equal(firstHerb.name.te, 'నల్ల ఉమ్మెత్త (Datura)');
  const hEdited = updateHerbInStore(hAdded, {
    ...firstHerb,
    sanskritName: 'Datura metel',
  });
  assert.equal(hEdited.herbs[0].sanskritName, 'Datura metel');
  const hRemoved = removeHerbFromStore(hEdited, firstHerb.id);
  assert.equal(hRemoved.herbs.length, INITIAL_STORE_DATA.herbs.length);

  const prepAdded = addPreparationToStore(INITIAL_STORE_DATA, {
    titleTe: 'సిద్ధ మకరధ్వజ రసాయన తయారీ',
    ingredientsTe: 'శుద్ధి చేసిన మూలికలు మరియు స్వర్ణ భస్మం.',
    stepsTe: ['మొదటి దశ కల్వంలో నూరాలి.', 'రెండవ దశ పుటం పెట్టాలి.'],
    imageUrl: 'data:image/svg+xml;utf8,<svg id="prep"></svg>',
  });
  const lastPrep = prepAdded.preparations[prepAdded.preparations.length - 1];
  assert.equal(lastPrep.title.te, 'సిద్ధ మకరధ్వజ రసాయన తయారీ');
  const prepEdited = updatePreparationInStore(prepAdded, {
    ...lastPrep,
    subtitle: { te: 'అత్యంత శక్తివంతమైన రసాయనం', en: 'Potent Rasayana' },
  });
  assert.equal(
    prepEdited.preparations[prepEdited.preparations.length - 1].subtitle.te,
    'అత్యంత శక్తివంతమైన రసాయనం'
  );
  const prepRemoved = removePreparationFromStore(prepEdited, lastPrep.id);
  assert.equal(
    prepRemoved.preparations.length,
    INITIAL_STORE_DATA.preparations.length
  );
});

test('submitPrivateAdToStore creates pending ad and Admin approval publishes it', () => {
  const afterSubmit = submitPrivateAdToStore(INITIAL_STORE_DATA, {
    title: 'ఆయుర్వేద మూలికా విక్రయ కేంద్రం',
    advertiserName: 'రామకృష్ణ',
    contactPhone: '9876543210',
    description: 'స్వచ్ఛమైన నల్ల పసుపు మరియు అశ్వగంధ వేర్లు లభించును.',
    youtubeUrl: 'https://www.youtube.com/watch?v=Vn_y9SOt3OU',
    imageUrl: 'data:image/svg+xml;utf8,<svg></svg>',
  });

  const submittedAd = afterSubmit.privateAds[0];
  assert.equal(submittedAd.status, 'pending');
  assert.equal(submittedAd.youtubeVideoId, 'Vn_y9SOt3OU');

  const afterApprove = updatePrivateAdStatusInStore(
    afterSubmit,
    submittedAd.id,
    'approved'
  );
  assert.equal(afterApprove.privateAds[0].status, 'approved');
});
