(() => {"use strict";

const win = window;const doc = document;

let gsap = win.gsap;
let ScrollTrigger = win.ScrollTrigger;
let Draggable = win.Draggable;
let Lenis = win.Lenis;

let pluginsReady = false;
let hasStarted = false;
let isCleaningUp = false;

if (typeof win.CLT_HOME_CLEANUP === "function") {
  try {
    win.CLT_HOME_CLEANUP({ reason: "reinit" });
  } catch (error) {
    console.warn("[home-clean.js] Previous cleanup failed.", error);
  }
}

function activateGsapPlugins() {
  if (!gsap || pluginsReady) return;

  const plugins = [];

  if (ScrollTrigger) plugins.push(ScrollTrigger);
  if (Draggable) plugins.push(Draggable);

  if (plugins.length && typeof gsap["registerPlugin"] === "function") {
    gsap["registerPlugin"](...plugins);
  }

  pluginsReady = true;
}

const SELECTOR = {// Matched to commonwealth-lyric-webflow.html.heroSection: "#clt-home-hero",heroPin: '[data-gsap="home-hero-pin"]',heroCanvas: "#hero-canvas",heroReveal: '[data-gsap="home-hero-reveal"]',heroEyebrow: '[data-gsap="home-hero-eyebrow"]',heroLine: '[data-gsap="home-hero-line"]',heroCta: '[data-gsap="home-hero-cta"]',

curtainStage: '[data-gsap="home-curtain-stage"]',
curtainLeft: "#clt-home-curtain-left",
curtainRight: "#clt-home-curtain-right",
curtainPrompt: '[data-gsap="home-curtain-prompt"]',
curtainPanelTop: '[data-gsap="home-curtain-panel-top"]',

dustRoot: "#star-container",
dustFar: "#dust-far",
dustMid: "#dust-mid",
dustNear: "#dust-near",
dustParticle: ".clt-home-dust.is-particle",
page: ".clt-page",

marqueeSection: '[data-webflow-section="acclaim-marquee"]',
marqueeTrack: ".clt-home-marquee.is-track",
marqueeSet: ".clt-home-marquee.is-set",

exploreSection: "#explore",
exploreMask: "#explore-mask",
exploreTrack: "#explore-track",
exploreCard: ".clt-home-explore.is-card",
exploreLens: "#clt-home-carousel-lens",

termsButton: "#terms-btn",
privacyButton: "#privacy-btn",
termsModal: "#terms-modal",
privacyModal: "#privacy-modal",
legalModal: ".clt-home-legal-modal",
legalPanel: ".clt-home-legal-modal.is-panel",
legalBackdrop: ".clt-home-legal-modal.is-backdrop",
legalHeader: ".clt-home-legal-modal.is-header",
legalTitle: ".clt-home-legal-modal.is-title",
legalClose: ".clt-home-legal-modal.is-close",
legalBody: ".clt-home-legal-modal.is-body",
legalCloseTrigger: "[data-close]",

};

const FRAME_URLS = ["https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a35ad19668aae30c2f4_frame-0001.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a35c6cbe27116ca83fd_frame-0002.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a35e5fb917b3701b693_frame-0003.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a35ea0f0eaf9849bc7d_frame-0004.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a353f53f75c4a4afc37_frame-0005.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a352b32486feac6ca3a_frame-0006.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3557c7ebe55cced14f_frame-0007.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a36c6cbe27116ca8413_frame-0008.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3599f0f4e3bce84ed8_frame-0009.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3576258272cd4cb6bd_frame-0010.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a35fd70d5f782392667_frame-0011.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a36bef6cbe7de7ee6be_frame-0012.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a360cf1cb07be8f575f_frame-0013.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a36af60118b3da98894_frame-0014.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a368bf83b4f96c0edc6_frame-0015.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a362ce081e1c2288a56_frame-0016.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a38c340810734eaf1bf_frame-0017.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a36cc037ef6b6ca93af_frame-0018.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3674a49421d8e64a51_frame-0019.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a37aaa45cd1f9ad9d3d_frame-0020.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a37b698f545445f3072_frame-0021.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a36fbe31da754432dd0_frame-0022.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3730e7ab983ff88785_frame-0023.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3791172a8381ba554b_frame-0024.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3712ed158393908b5b_frame-0025.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a371f30f5e609c6d713_frame-0026.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a37a443bb054c91a82a_frame-0027.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a37c2aefe6f66c49b9b_frame-0028.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a38d1a7c9294893e5ad_frame-0029.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a376c15ae5cf118aa6e_frame-0030.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a37ce07cea9e0f2bac7_frame-0031.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3848d6eac10c55faf1_frame-0032.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a387aebda0073e143c0_frame-0033.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3870ed7d5cbe1eeed9_frame-0034.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a391e118e4eb775798b_frame-0035.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a38d1a7c9294893e5cd_frame-0036.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a38bbf57eb4cbe6c2dd_frame-0037.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a396931768c599e07af_frame-0038.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a38d1a7c9294893e5b9_frame-0039.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3828e0ee0d39a276d2_frame-0040.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a38910e69bbb92c6f18_frame-0041.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a38ce07cea9e0f2bae9_frame-0042.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3996e6be40cc4675a8_frame-0043.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3954c45d626d87cafa_frame-0044.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3956dc0a5be159afca_frame-0045.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a39ea0f0eaf9849bcd8_frame-0047.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a39340140c4a507f230_frame-0048.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a39d1a7c9294893e5e2_frame-0049.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a39f727e166199c61bf_frame-0050.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3a30f205fd825e03a9_frame-0051.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3ae7587cb7254ee555_frame-0052.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3a07eed619dbb4e4aa_frame-0053.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3b0bb5b86c7d7069ef_frame-0054.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3bfd70d5f7823926b9_frame-0055.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3bc2816e961d9bc668_frame-0056.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3a1ece60cdf119ba33_frame-0057.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3b9e24e5bce33a63c6_frame-0058.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3bcbe6d89d3daa8e43_frame-0059.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3be7587cb7254ee569_frame-0060.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3bbe06050c80133155_frame-0061.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3b3906db07ec1bd079_frame-0062.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3cb58dc8cd882f2091_frame-0063.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3cc2aefe6f66c49c25_frame-0064.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3c3e5bc3f756bfb835_frame-0065.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3c1bc4b4982343ffdb_frame-0066.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3ca38bfb58b2618bbc_frame-0067.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3c3a6b8e8e1cea69e9_frame-0068.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3c72a900ff71000f61_frame-0069.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3cb9ce81d003e85c5a_frame-0070.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3c54c45d626d87cb63_frame-0071.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3dce07cea9e0f2bb35_frame-0072.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3dbef6cbe7de7ee728_frame-0073.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3d0f84346383459460_frame-0074.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3dcb137bad351d487d_frame-0075.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3d742c9dd58f1df76c_frame-0076.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3dcc037ef6b6ca9448_frame-0077.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3df15f0eb7499d378e_frame-0078.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3d4b92169c2c0ba4be_frame-0079.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3d1b20876355f37c47_frame-0080.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3d3906db07ec1bd08e_frame-0081.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3ec6e6531097d64768_frame-0082.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3e63bfbec4c46c714b_frame-0083.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3e2d31e03478434f1e_frame-0084.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3ea023cdced8eb993b_frame-0085.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3e91172a8381ba55cc_frame-0086.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3ea29e11ad6e988c81_frame-0087.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3fe61bcab7a436e274_frame-0088.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3f660858e96979de86_frame-0089.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3fbeddd5210b82822a_frame-0090.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3f43a6cb4ab827ff62_frame-0091.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3fc2816e961d9bc733_frame-0092.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3fe9f1e0b11f7ce49c_frame-0093.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a40275a8625e03cd6bd_frame-0094.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a40b93bb0732bfef0f0_frame-0095.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a403fa1e48ae3cc8e9d_frame-0096.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a403ece741832a8219d_frame-0097.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a40799dcbece37c4110_frame-0098.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a40efb8cf1031cd4afc_frame-0099.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a401ece60cdf119badd_frame-0100.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a405bb8e98d36d644ad_frame-0101.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a40eb145601d076419a_frame-0102.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a41567b702dcc3d18c5_frame-0103.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a415c8f8a44d977465b_frame-0104.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4101b6f40d2d832ce2_frame-0105.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a412716fe8617142b0c_frame-0106.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a419e24e5bce33a6417_frame-0108.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a410b10dc7360c90f97_frame-0109.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a414f739c84981cf04e_frame-0110.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a426ce43654e71c9fe3_frame-0111.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a42aaa45cd1f9ad9d8b_frame-0112.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a423a6b8e8e1cea6a77_frame-0113.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4239fdaf7c92706366_frame-0114.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4256c809384381bc44_frame-0115.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a42d1d4e5bc375da69b_frame-0116.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a423ab3744c2a5c486e_frame-0117.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a42f15f0eb7499d37d9_frame-0118.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a43097e3e4f6ec78770_frame-0119.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4311f0be990734fe7d_frame-0120.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a434f739c84981cf062_frame-0121.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a438e705fb40c09299a_frame-0122.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a43841c442b7016d945_frame-0123.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a43364b0a4d8f785569_frame-0124.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a44d26c1f6fe0bc00c7_frame-0125.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a442afaaee3a2663941_frame-0126.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a44751b23bd914ded02_frame-0127.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a44354572db1da09f19_frame-0128.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a444cfa5c5e15ebbb08_frame-0129.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4476258272cd4cb7cc_frame-0130.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a44099f73df0a6a1297_frame-0131.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a448560082423df8d4e_frame-0132.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a449f6c144ad82daa4f_frame-0133.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a45b6f436467f3736c9_frame-0134.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a45beddd5210b82827e_frame-0135.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a45f8c75d10e4359658_frame-0136.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a45249b5c83297f9444_frame-0137.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4592546979db11319d_frame-0138.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a45f2d8d4ac76520426_frame-0139.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4688f202d72a9fea0a_frame-0140.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a468e705fb40c0929c8_frame-0141.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a455db0694214a74552_frame-0142.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a46567b702dcc3d19db_frame-0143.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a46e5b9a26605a9332d_frame-0144.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a46be06050c801332a6_frame-0145.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a46cc335f46dab0df83_frame-0146.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4bb6f436467f3738ae_frame-0147.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a47d26c1f6fe0bc0271_frame-0148.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a46d26c1f6fe0bc0256_frame-0149.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a46eb99db6c549dfb21_frame-0150.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a471e118e4eb7757a62_frame-0151.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a49066d8e822f42d252_frame-0152.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4bedb4722c99c8e975_frame-0153.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4a8f89be046ed0446e_frame-0154.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4991172a8381ba5628_frame-0155.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4a6ef070f7aa731534_frame-0156.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4a9e7ac4761ba9767c_frame-0157.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a47fd70d5f7823926ff_frame-0158.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4a1bc4b49823440090_frame-0159.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4a0ec24e311b11db66_frame-0160.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4a61d2a6be196c5a23_frame-0161.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4bc7c37d65ad906ddf_frame-0162.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4b8acd6bf9b7adb804_frame-0163.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4aeb145601d0764222_frame-0164.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4bfc1775799f12ab0d_frame-0165.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4a0e9889939b999acf_frame-0166.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4bed275c6736f03f0c_frame-0167.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4bf4e0e9b9731a75df_frame-0168.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4c30e7ab983ff88c52_frame-0169.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4c20785b9922af78d2_frame-0171.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4ccfebf91f245697cd_frame-0172.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4c1e87e0cf21b3e4e0_frame-0173.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4c604992735e1f1b0b_frame-0174.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4c4cb1e12be394d4f2_frame-0175.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4cdc1e72c50e3a0b50_frame-0176.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4dfe52ab7f12cf51da_frame-0177.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4d1ece60cdf119bb26_frame-0178.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4d0d8e45c8af33651a_frame-0179.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4d74a49421d8e64c3a_frame-0180.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4e679f5b8f26d68ad2_frame-0181.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4e8560082423df8e23_frame-0182.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4ece07cea9e0f2bc2f_frame-0183.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4f8bc2eb5ae2f2c9b8_frame-0184.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4fcdeeffc95f29c717_frame-0185.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4e20785b9922af7913_frame-0186.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4ecfebf91f245699bb_frame-0187.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4ef3ad3ca4178970a9_frame-0188.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4ef727a538f3c5d9c4_frame-0189.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4f4edbae5dd4552f1c_frame-0190.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4fa29e11ad6e988dc1_frame-0193.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4f275a8625e03cd768_frame-0194.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4fe01d7dadb6eeffd3_frame-0195.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4fefb8cf1031cd4bd8_frame-0196.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4fb5748c2ba0caec76_frame-0197.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a50995f71e13063b0dd_frame-0198.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a50354572db1da09fab_frame-0199.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a50099f73df0a6a13e5_frame-0200.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a50751b23bd914ded9f_frame-0201.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a50567b702dcc3d1a58_frame-0202.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a509427ff4537867863_frame-0203.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a511ece60cdf119bb86_frame-0204.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a51fe52ab7f12cf51fa_frame-0205.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a51dc1e72c50e3a0ca2_frame-0206.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a5128e0ee0d39a278ef_frame-0207.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a51c6e6531097d64a89_frame-0208.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a5149461c37f719138a_frame-0209.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a5120785b9922af7960_frame-0210.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a5233023d85dc4e741a_frame-0211.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4688ffe7ca32af0fd6_frame-0212.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a473f53f75c4a4afd84_frame-0213.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a47c7c37d65ad906dad_frame-0214.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a470e9889939b999a90_frame-0215.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a47f72a9a028dcc066e_frame-0216.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a48f4eec82dd5e0fbb0_frame-0217.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a48dc1e72c50e3a0b1c_frame-0218.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a484314e618440c4ea6_frame-0219.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a483fa1e48ae3cc8ef1_frame-0220.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a481945969ab35e4870_frame-0221.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a48a7df565953258c13_frame-0222.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4807eed619dbb4e63e_frame-0223.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a48f72a9a028dcc0684_frame-0224.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a48c0d305bf40ce7331_frame-0225.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a484314e618440c4ecd_frame-0226.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a498560082423df8d92_frame-0227.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a491945969ab35e488b_frame-0228.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a52f4e0e9b9731a7607_frame-0229.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a52424ba9e393c7d238_frame-0230.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a52a38bfb58b2618ca5_frame-0231.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a521ece60cdf119bbb5_frame-0232.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a523f53f75c4a4aff7c_frame-0234.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a536ef070f7aa73158f_frame-0235.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a533ab3744c2a5c48e8_frame-0236.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a539ef94c938cf07c5d_frame-0237.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a53046ae8dbd4712dd3_frame-0238.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a53d31334c4f81020d6_frame-0239.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a5310ab427d2ebf3e02_frame-0240.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a5396e6be40cc4676ed_frame-0241.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a538fe44dc6b4f58026_frame-0242.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a5307eed619dbb4e6ca_frame-0243.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a530b10dc7360c910d4_frame-0244.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a5402b663b89be2543f_frame-0245.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a541f30f5e609c6d8b1_frame-0246.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a54e1517a752ec189bc_frame-0247.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a540030b57ecf440576_frame-0248.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a54f29cfaca54deb5e2_frame-0249.avif","https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a54f4eec82dd5e0fca3_frame-0250.avif"];

const reducedMotion = win.matchMedia("(prefers-reduced-motion: reduce)").matches;const isTouch = win.matchMedia("(pointer: coarse)").matches;const isSmallViewport = win.matchMedia("(max-width: 760px)").matches;const isMobileLike = isTouch || isSmallViewport;const frameStep = isMobileLike ? 3 : 1;

const frameCount = FRAME_URLS.length;const titleRevealStart = 0.66;const titleRevealEnd = 0.92;const dustDensity = 1.32;

const clamp = (min, max, value) => Math.min(max, Math.max(min, value));const random = (min, max) => min + Math.random() * (max - min);const query = (selector, scope = doc) => scope.querySelector(selector);const queryAll = (selector, scope = doc) => Array.from(scope.querySelectorAll(selector));

const cleanups = [];const listen = (target, type, handler, options) => {if (!target || !target.addEventListener) return () => undefined;target.addEventListener(type, handler, options);const cleanup = () => target.removeEventListener(type, handler, options);cleanups.push(cleanup);return cleanup;};

let mainContext = null;let heroCanvas = null;let heroCanvasContext = null;let resizeObserver = null;let currentFrame = 0;let lenis = null;let lastKnownVelocity = 0;

let heroCanvasCssWidth = 0;let heroCanvasCssHeight = 0;let heroCanvasPixelWidth = 0;let heroCanvasPixelHeight = 0;let heroCanvasResizeQueued = false;

const frames = new Array(frameCount);const framePromises = new Array(frameCount);

function normalizedFrame(index) {const rounded = Math.round(index);if (frameStep === 1) return clamp(0, frameCount - 1, rounded);return clamp(0, frameCount - 1, Math.round(rounded / frameStep) * frameStep);}

function loadFrame(index) {const safeIndex = normalizedFrame(index);

if (frames[safeIndex]) return Promise.resolve(frames[safeIndex]);
if (framePromises[safeIndex]) return framePromises[safeIndex];

framePromises[safeIndex] = new Promise((resolve) => {
  const image = new Image();
  image.decoding = "async";
  image.onload = () => {
    frames[safeIndex] = image;
    resolve(image);
  };
  image.onerror = () => resolve(null);
  image.src = FRAME_URLS[safeIndex];
});

return framePromises[safeIndex];

}

function closestLoadedFrame(index) {if (frames[index]) return index;

for (let distance = 1; distance < frameCount; distance += 1) {
  const before = index - distance;
  const after = index + distance;

  if (before >= 0 && frames[before]) return before;
  if (after < frameCount && frames[after]) return after;
}

return -1;

}

function drawFrame(index) {if (!heroCanvas || !heroCanvasContext || !frameCount) return;

const safeIndex = normalizedFrame(index);
currentFrame = safeIndex;

if (!frames[safeIndex]) {
  loadFrame(safeIndex).then(() => {
    if (currentFrame === safeIndex) drawFrame(safeIndex);
  });
}

const drawableIndex = closestLoadedFrame(safeIndex);
if (drawableIndex < 0) return;

const image = frames[drawableIndex];
if (!image || !image.naturalWidth || !image.naturalHeight) return;

const canvasWidth = heroCanvas.width;
const canvasHeight = heroCanvas.height;
const scale = Math.max(canvasWidth / image.naturalWidth, canvasHeight / image.naturalHeight);
const width = image.naturalWidth * scale;
const height = image.naturalHeight * scale;

heroCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
heroCanvasContext.drawImage(
  image,
  (canvasWidth - width) / 2,
  (canvasHeight - height) / 2,
  width,
  height
);

}

function getCanvasDpr() {return Math.min(win.devicePixelRatio || 1, isMobileLike ? 1.25 : 2);}

function resizeHeroCanvasFromCache(width, height) {if (!heroCanvas || !heroCanvasContext) return;

const cssWidth = Math.max(1, Math.round(width || heroCanvasCssWidth || win.innerWidth || 1));
const cssHeight = Math.max(1, Math.round(height || heroCanvasCssHeight || ((win.visualViewport && win.visualViewport.height) || win.innerHeight) || 1));
const dpr = getCanvasDpr();
const pixelWidth = Math.round(cssWidth * dpr);
const pixelHeight = Math.round(cssHeight * dpr);

if (
  pixelWidth === heroCanvasPixelWidth &&
  pixelHeight === heroCanvasPixelHeight &&
  heroCanvas.width === pixelWidth &&
  heroCanvas.height === pixelHeight
) {
  return;
}

heroCanvasCssWidth = cssWidth;
heroCanvasCssHeight = cssHeight;
heroCanvasPixelWidth = pixelWidth;
heroCanvasPixelHeight = pixelHeight;

heroCanvas.width = pixelWidth;
heroCanvas.height = pixelHeight;

drawFrame(currentFrame);

}

function runQueuedHeroCanvasResize() {heroCanvasResizeQueued = false;resizeHeroCanvasFromCache();}

function queueHeroCanvasResize(width, height) {if (width) heroCanvasCssWidth = width;if (height) heroCanvasCssHeight = height;

if (heroCanvasResizeQueued) return;

heroCanvasResizeQueued = true;
gsap.ticker.add(runQueuedHeroCanvasResize, true, true);

}

function scheduleIdle(callback) {if ("requestIdleCallback" in win) {win.requestIdleCallback(callback, { timeout: 350 });return;}

win.setTimeout(callback, 80);

}

function preloadFrames() {if (!frameCount) return;

loadFrame(0).then(() => drawFrame(0));
loadFrame(frameCount - 1);

const queue = [];
for (let index = frameStep; index < frameCount - 1; index += frameStep) {
  queue.push(index);
}

let cursor = 0;
const batchSize = isMobileLike ? 3 : 8;

const loadBatch = () => {
  const batch = queue.slice(cursor, cursor + batchSize);
  cursor += batchSize;

  batch.forEach((index) => {
    loadFrame(index).then((image) => {
      if (image && Math.abs(index - currentFrame) <= frameStep) {
        drawFrame(currentFrame);
      }
    });
  });

  if (cursor < queue.length) scheduleIdle(loadBatch);
};

scheduleIdle(loadBatch);

}

function initHeroCanvas() {heroCanvas = query(SELECTOR.heroCanvas);if (!heroCanvas) return;

heroCanvasContext = heroCanvas.getContext("2d", { alpha: false });
if (!heroCanvasContext) return;

resizeHeroCanvasFromCache(win.innerWidth || 1, (win.visualViewport && win.visualViewport.height) || win.innerHeight || 1);

if ("ResizeObserver" in win) {
  resizeObserver = new ResizeObserver((entries) => {
    const entry = entries[0];
    if (!entry) return;

    queueHeroCanvasResize(entry.contentRect.width, entry.contentRect.height);
  });

  resizeObserver.observe(heroCanvas);
  cleanups.push(() => resizeObserver.disconnect());
} else {
  listen(win, "resize", () => {
    queueHeroCanvasResize(win.innerWidth || 1, (win.visualViewport && win.visualViewport.height) || win.innerHeight || 1);
  }, { passive: true });
}

preloadFrames();

}

function buildHeroTitleTimeline() {const eyebrow = query(SELECTOR.heroEyebrow);const lines = queryAll(SELECTOR.heroLine);const titleLines = lines.filter((line) => !line.classList.contains("is-presents"));const presents = lines.filter((line) => line.classList.contains("is-presents"));const cta = query(SELECTOR.heroCta);const targets = [eyebrow, ...titleLines, ...presents, cta].filter(Boolean);

if (!targets.length) return null;

gsap.set(targets, { autoAlpha: 0, y: "2rem", filter: "blur(0.75rem)", force3D: true });
gsap.set(titleLines, { y: "2.75rem" });

return gsap.timeline({
  paused: true,
  defaults: { ease: "power3.out" },
})
  .to(eyebrow, { autoAlpha: 1, y: 0, filter: "blur(0rem)", duration: 0.24 }, 0)
  .to(titleLines, { autoAlpha: 1, y: 0, filter: "blur(0rem)", duration: 0.5, stagger: 0.06 }, 0.08)
  .to(presents, { autoAlpha: 1, y: 0, filter: "blur(0rem)", duration: 0.28 }, 0.5)
  .to(cta, { autoAlpha: 1, y: 0, filter: "blur(0rem)", duration: 0.34 }, 0.62);

}

function showReducedHero() {loadFrame(0).then(() => drawFrame(0));

const reveal = query(SELECTOR.heroReveal);
const cta = query(SELECTOR.heroCta);
const curtainStage = query(SELECTOR.curtainStage);
const titleTargets = [
  query(SELECTOR.heroEyebrow),
  ...queryAll(SELECTOR.heroLine),
  cta,
].filter(Boolean);

gsap.set(titleTargets, { autoAlpha: 1, y: 0, clearProps: "transform,filter" });

if (reveal) reveal.style.pointerEvents = "auto";
if (cta) cta.style.pointerEvents = "auto";
if (curtainStage) curtainStage.style.display = "none";

}

function initHeroScrub() {const heroPin = query(SELECTOR.heroPin);if (!heroPin) return;

const reveal = query(SELECTOR.heroReveal);
const cta = query(SELECTOR.heroCta);
const titleTimeline = buildHeroTitleTimeline();

ScrollTrigger.create({
  trigger: heroPin,
  start: "top top",
  end: "bottom bottom",
  scrub: true,
  invalidateOnRefresh: true,
  onUpdate(self) {
    drawFrame(self.progress * (frameCount - 1));

    if (!titleTimeline) return;

    const titleProgress = clamp(
      0,
      1,
      (self.progress - titleRevealStart) / (titleRevealEnd - titleRevealStart)
    );

    titleTimeline.progress(titleProgress);

    const active = titleProgress >= 0.98;
    if (reveal) reveal.style.pointerEvents = active ? "auto" : "none";
    if (cta) cta.style.pointerEvents = active ? "auto" : "none";
  },
});

}

function initCurtain() {const heroPin = query(SELECTOR.heroPin);const stage = query(SELECTOR.curtainStage);const left = query(SELECTOR.curtainLeft);const right = query(SELECTOR.curtainRight);const prompt = query(SELECTOR.curtainPrompt);

if (!heroPin || !stage || !left || !right) return;

const foldPositions = ["8%", "19%", "31%", "44%", "57%", "69%", "82%", "92%"];
const foldAnimations = ["curtain-fold-a", "curtain-fold-b", "curtain-fold-c", "curtain-fold-d"];

[left, right].forEach((panel, sideIndex) => {
  if (panel.dataset.foldsReady === "true") return;

  const anchor = query(SELECTOR.curtainPanelTop, panel);

  foldPositions.forEach((position, index) => {
    const fold = doc.createElement("div");
    const depth = index % 2 === 0 ? "deep" : "shallow";
    const animation = foldAnimations[(index + sideIndex) % foldAnimations.length];

    fold.className = `clt-home-curtain is-fold is-${depth}`;
    fold.style.left = position;
    fold.style.animation = `${animation} ${6 + index * 0.18}s ${index * 0.16}s ease-in-out infinite alternate`;

    panel.insertBefore(fold, anchor || null);
  });

  panel.dataset.foldsReady = "true";
});

ScrollTrigger.create({
  trigger: heroPin,
  start: "top top",
  end: "bottom bottom",
  scrub: true,
  invalidateOnRefresh: true,
  onUpdate(self) {
    const openProgress = clamp(0, 1, self.progress / 0.14);
    const eased = 1 - Math.pow(1 - openProgress, 3);
    const travel = eased * 112;
    const gather = 1 - eased * 0.24;
    const sway = Math.sin(openProgress * Math.PI) * 3;

    gsap.set(left, {
      xPercent: -travel,
      scaleX: gather,
      skewY: sway,
      transformOrigin: "100% 50%",
      force3D: true,
    });

    gsap.set(right, {
      xPercent: travel,
      scaleX: gather,
      skewY: -sway,
      transformOrigin: "0% 50%",
      force3D: true,
    });

    if (prompt) {
      gsap.set(prompt, { autoAlpha: clamp(0, 1, 1 - openProgress * 4.5) });
    }

    stage.style.visibility = openProgress >= 1 ? "hidden" : "visible";
  },
});

}

function initHeroMagnet() {const cta = query(SELECTOR.heroCta);if (!cta || reducedMotion || isTouch) return;

const moveX = gsap.quickTo(cta, "x", { duration: 0.28, ease: "power3.out" });
const moveY = gsap.quickTo(cta, "y", { duration: 0.28, ease: "power3.out" });
const rotate = gsap.quickTo(cta, "rotation", { duration: 0.35, ease: "power3.out" });

let bounds = null;
let boundsCall = null;

const updateBounds = () => {
  bounds = cta.getBoundingClientRect();
};

listen(cta, "pointerenter", updateBounds, { passive: true });

listen(cta, "pointermove", (event) => {
  if (!bounds) updateBounds();

  const x = event.clientX - bounds.left - bounds.width / 2;
  const y = event.clientY - bounds.top - bounds.height / 2;

  moveX(clamp(-10, 10, x * 0.16));
  moveY(clamp(-8, 8, y * 0.14));
  rotate(clamp(-3, 3, x * 0.035));
}, { passive: true });

listen(cta, "pointerleave", () => {
  bounds = null;
  moveX(0);
  moveY(0);
  rotate(0);
});

listen(win, "resize", () => {
  bounds = null;
  if (boundsCall) boundsCall.kill();
  boundsCall = gsap.delayedCall(0.18, () => {
    if (doc.pointerLockElement !== cta) return;
    updateBounds();
  });
}, { passive: true });

cleanups.push(() => {
  if (boundsCall) boundsCall.kill();
});

}

function getScrollY() {if (lenis && typeof lenis.scroll === "number") return lenis.scroll;return win.scrollY || doc.documentElement.scrollTop || 0;}

function initLenis() {
  if (reducedMotion || isMobileLike || !Lenis) return;

  let ownsLenis = false;

  const handleScroll = (event) => {
    lastKnownVelocity = typeof event.velocity === "number" ? event.velocity : 0;

    if (ScrollTrigger && typeof ScrollTrigger.update === "function") {
      ScrollTrigger.update();
    }
  };

  const existingLenis = win.CLT_HOME_LENIS;

  if (existingLenis && typeof existingLenis.raf === "function") {
    lenis = existingLenis;
  } else {
    lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.25,
      infinite: false,
      autoRaf: false,
    });

    ownsLenis = true;
    win.CLT_HOME_LENIS = lenis;
    win.lenis = lenis;
  }

  const updateLenis = (time) => {
    if (!lenis || typeof lenis.raf !== "function") return;
    lenis.raf(time * 1000);
  };

  gsap.ticker.add(updateLenis);
  gsap.ticker.lagSmoothing(0);

  if (typeof lenis.on === "function") {
    lenis.on("scroll", handleScroll);
  }

  cleanups.push(() => {
    gsap.ticker.remove(updateLenis);

    if (lenis && typeof lenis.off === "function") {
      lenis.off("scroll", handleScroll);
    }

    if (ownsLenis && lenis && typeof lenis.destroy === "function") {
      lenis.destroy();
    }

    if (ownsLenis && win.CLT_HOME_LENIS === lenis) {
      win.CLT_HOME_LENIS = null;
    }

    if (ownsLenis && win.lenis === lenis) {
      win.lenis = null;
    }

    lenis = null;
    lastKnownVelocity = 0;
  });
}

function initDust() {const far = query(SELECTOR.dustFar);const mid = query(SELECTOR.dustMid);const near = query(SELECTOR.dustNear);const root = query(SELECTOR.dustRoot);const containers = [far, mid, near].filter(Boolean);

if (!containers.length) return;

containers.forEach((container) => {
  queryAll(SELECTOR.dustParticle, container).forEach((particle) => particle.remove());
});

const density = reducedMotion ? 0.35 : (isMobileLike ? 0.7 : dustDensity);
const tones = ["warm", "warm", "warm", "brass", "brass", "cool"];
const stars = [];
const spawn = (container, count, minSize, maxSize, depth) => {
  if (!container) return;

  const fragment = doc.createDocumentFragment();
  const total = Math.round(count * density);

  for (let index = 0; index < total; index += 1) {
    const element = doc.createElement("div");
    const tone = tones[Math.floor(Math.random() * tones.length)];
    const size = random(minSize, maxSize);
    const baseX = random(0, 100);
    const baseY = random(0, 100);

    element.className = `clt-home-dust is-particle is-${tone}`;
    element.style.width = `${size}px`;
    element.style.height = `${size}px`;
    element.style.left = `${baseX}%`;
    element.style.top = `${baseY}%`;
    element.style.willChange = "transform, opacity";
    element.style.setProperty("--twinkle-dur", `${random(2.4, 7.2)}s`);
    element.style.setProperty("--twinkle-delay", `${random(0, 5.5)}s`);
    element.style.setProperty("--twinkle-lo", random(0.15, 0.36).toFixed(2));
    element.style.setProperty("--twinkle-hi", random(0.72, 1).toFixed(2));

    fragment.appendChild(element);

    const star = {
      element,
      baseY,
      depth,
      floatX: 0,
      floatY: 0,
      inertiaX: 0,
      inertiaY: 0,
      pointerY: 0,
      setCss: gsap.quickSetter(element, "css"),
    };

    gsap.to(star, {
      floatX: random(-18, 18) * depth,
      floatY: random(-22, 22) * depth,
      duration: random(18, 42),
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    stars.push(star);
  }

  container.appendChild(fragment);
};

spawn(far, 46, 1.0, 2.0, 0.45);
spawn(mid, 31, 1.3, 2.8, 0.78);
spawn(near, 18, 1.8, 3.6, 1.15);

cleanups.push(() => {
  stars.forEach((star) => star.element.remove());
});

if (reducedMotion || !stars.length) return;

let lastScroll = getScrollY();
let scrollImpulse = 0;
let pointerImpulseX = 0;
let pointerImpulseY = 0;
let lastPointerX = 0;
let lastPointerY = 0;
let hasPointer = false;

const removePointerMove = isTouch ? () => undefined : listen(win, "pointermove", (event) => {
  if (!hasPointer) {
    lastPointerX = event.clientX;
    lastPointerY = event.clientY;
    hasPointer = true;
    return;
  }

  pointerImpulseX += clamp(-30, 30, event.clientX - lastPointerX) * 0.22;
  pointerImpulseY += clamp(-30, 30, event.clientY - lastPointerY) * 0.16;
  lastPointerX = event.clientX;
  lastPointerY = event.clientY;
}, { passive: true });

const ticker = () => {
  const scroll = getScrollY();
  const scrollDelta = scroll - lastScroll;
  const velocity = lenis ? lastKnownVelocity * 1000 : scrollDelta * 60;

  lastScroll = scroll;
  scrollImpulse += clamp(-90, 90, scrollDelta);

  stars.forEach((star) => {
    const parallaxY = -scroll * 0.065 * star.depth;
    const targetInertiaY = -scrollImpulse * 0.085 * star.depth;
    const targetInertiaX = pointerImpulseX * 0.08 * star.depth;
    const targetPointerY = pointerImpulseY * 0.035 * star.depth;

    star.inertiaY += (targetInertiaY + targetPointerY - star.inertiaY) * 0.11;
    star.inertiaX += (targetInertiaX - star.inertiaX) * 0.09;
    star.pointerY += (targetPointerY - star.pointerY) * 0.08;

    const stretch = clamp(1, 1.72, 1 + (Math.abs(velocity) / 4200) * 0.48 * star.depth);
    const rotate = clamp(-14, 14, (scrollDelta * 0.08 + pointerImpulseX * 0.05) * star.depth);

    star.setCss({
      x: star.floatX + star.inertiaX,
      y: parallaxY + star.floatY + star.inertiaY + star.pointerY,
      scaleY: stretch,
      rotation: rotate,
      force3D: true,
    });
  });

  scrollImpulse *= 0.9;
  pointerImpulseX *= 0.86;
  pointerImpulseY *= 0.86;
};

gsap.ticker.add(ticker);

const page = query(SELECTOR.page);

if (page && root && far) {
  gsap.to(far, {
    y: 70,
    ease: "none",
    scrollTrigger: {
      trigger: page,
      start: "top top",
      end: "bottom bottom",
      scrub: 1.3,
      invalidateOnRefresh: true,
    },
  });
}

if (page && root && mid) {
  gsap.to(mid, {
    y: -130,
    ease: "none",
    scrollTrigger: {
      trigger: page,
      start: "top top",
      end: "bottom bottom",
      scrub: 1.5,
      invalidateOnRefresh: true,
    },
  });
}

if (page && root && near) {
  gsap.to(near, {
    y: -260,
    ease: "none",
    scrollTrigger: {
      trigger: page,
      start: "top top",
      end: "bottom bottom",
      scrub: 1.8,
      invalidateOnRefresh: true,
    },
  });
}

cleanups.push(() => {
  gsap.ticker.remove(ticker);
  removePointerMove();
});

}

function initMobileViewportLock() {if (!isMobileLike) return;

const sync = () => {
  const height = Math.round((win.visualViewport && win.visualViewport.height) || win.innerHeight || 1);
  const hero = query(SELECTOR.heroSection);
  const heroPin = query(SELECTOR.heroPin);
  const pinMultiplier = parseFloat(win.getComputedStyle(hero || doc.documentElement).getPropertyValue("--pin-multiplier")) || 3;

  doc.documentElement.style.setProperty("--clt-js-vh", `${height * 0.01}px`);

  if (hero) hero.style.minHeight = `${height}px`;
  if (heroPin) heroPin.style.minHeight = `${Math.round(height * pinMultiplier)}px`;

  resizeHeroCanvasFromCache(win.innerWidth || 1, height);
  ScrollTrigger.refresh();
};

sync();
listen(win, "orientationchange", () => win.setTimeout(sync, 160), { passive: true });

if (win.visualViewport) {
  listen(win.visualViewport, "resize", () => win.setTimeout(sync, 120), { passive: true });
}

}

function initHeroPinGuard() {const hero = query(SELECTOR.heroSection);const heroPin = query(SELECTOR.heroPin);if (!hero || !heroPin) return;

const pinMultiplier = parseFloat(win.getComputedStyle(doc.documentElement).getPropertyValue("--pin-multiplier")) || 5;
const viewportHeight = Math.max(1, win.innerHeight || doc.documentElement.clientHeight || 1);
const minimumPinHeight = Math.round(viewportHeight * pinMultiplier);

// Sticky pinning will fail if a parent clips/scrolls the sticky context.
// Your uploaded HTML had an earlier .clt-page overflow rule, so this keeps
// the page wrapper from blocking the hero's sticky behavior.
const page = query(SELECTOR.page);
if (page) {
  const pageStyles = win.getComputedStyle(page);
  const overflowY = pageStyles.overflowY;
  const overflow = pageStyles.overflow;

  if (overflowY === "clip" || overflowY === "hidden" || overflow === "clip" || overflow === "hidden") {
    page.style.overflow = "visible";
  }
}

heroPin.style.overflow = "visible";
heroPin.style.minHeight = `${minimumPinHeight}px`;

hero.style.position = "sticky";
hero.style.top = "0";
hero.style.minHeight = "calc(var(--clt-js-vh, 1vh) * 100)";
hero.style.overflow = "hidden";

}

function initMarquee() {const track = query(SELECTOR.marqueeTrack);const section = query(SELECTOR.marqueeSection) || (track && track.closest(SELECTOR.marqueeSection));if (!track || !section) return;

if (track.dataset.marqueeReady !== "true") {
  const sets = queryAll(SELECTOR.marqueeSet, track);

  if (sets.length === 1) {
    const clone = sets[0].cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    track.appendChild(clone);
  }

  track.dataset.marqueeReady = "true";
}

const firstSet = query(SELECTOR.marqueeSet, track);
if (!firstSet) return;

track.style.animation = "none";

let setWidth = 1;
let direction = 1;
let isHovering = false;

let marqueeSizeDirty = true;
let marqueeResizeCall = null;

const updateWidth = () => {
  if (!marqueeSizeDirty) return;

  marqueeSizeDirty = false;
  setWidth = Math.max(1, firstSet.scrollWidth || 1);
};

updateWidth();

if ("ResizeObserver" in win) {
  const marqueeObserver = new ResizeObserver(() => {
    marqueeSizeDirty = true;

    if (marqueeResizeCall) marqueeResizeCall.kill();
    marqueeResizeCall = gsap.delayedCall(0.12, () => {
      updateWidth();
      marqueeTween.invalidate();
    });
  });

  marqueeObserver.observe(firstSet);
  cleanups.push(() => marqueeObserver.disconnect());
}

const marqueeTween = gsap.to(track, {
  x: () => -setWidth,
  duration: () => setWidth / (isMobileLike ? 45 : 70),
  ease: "none",
  repeat: -1,
  modifiers: {
    x: (value) => `${parseFloat(value) % -setWidth}px`,
  },
});

const updateSpeed = (speed = 1) => {
  gsap.to(marqueeTween, {
    timeScale: direction * (isHovering ? 0.28 : speed),
    duration: 0.45,
    overwrite: true,
  });
};

listen(section, "mouseenter", () => {
  isHovering = true;
  updateSpeed(1);
});

listen(section, "mouseleave", () => {
  isHovering = false;
  updateSpeed(1);
});

listen(win, "resize", () => {
  marqueeSizeDirty = true;

  if (marqueeResizeCall) marqueeResizeCall.kill();
  marqueeResizeCall = gsap.delayedCall(0.18, () => {
    updateWidth();
    marqueeTween.invalidate();
  });
}, { passive: true });

cleanups.push(() => {
  if (marqueeResizeCall) marqueeResizeCall.kill();
});

ScrollTrigger.create({
  trigger: section,
  start: "top bottom",
  end: "bottom top",
  onUpdate(self) {
    direction = self.direction || 1;
    const velocityBoost = clamp(1, 4, Math.abs(self.getVelocity()) / 2200);
    updateSpeed(velocityBoost);
  },
});

}

function wrapNegativeX(x, width) {if (!width) return 0;return ((x % -width) + -width) % -width;}

function initExploreCarousel() {const section = query(SELECTOR.exploreSection);const mask = query(SELECTOR.exploreMask);const track = query(SELECTOR.exploreTrack);if (!section || !mask || !track) return;

const originalCards = queryAll(SELECTOR.exploreCard, track).filter((card) => card.dataset.clone !== "true");
if (!originalCards.length) return;

if (track.dataset.clonesReady !== "true") {
  originalCards.forEach((card) => {
    const clone = card.cloneNode(true);
    clone.dataset.clone = "true";
    clone.setAttribute("aria-hidden", "true");
    track.appendChild(clone);
  });

  track.dataset.clonesReady = "true";
}

const allCards = queryAll(SELECTOR.exploreCard, track);

let setWidth = 1;
let carouselSizeDirty = true;
let carouselResizeCall = null;
let carouselIsDragging = false;

const updateSetWidth = () => {
  if (!carouselSizeDirty) return;

  carouselSizeDirty = false;
  setWidth = Math.max(1, track.scrollWidth / 2);

  const currentX = Number(gsap.getProperty(track, "x")) || 0;
  gsap.set(track, { x: wrapNegativeX(currentX, setWidth) });
};

updateSetWidth();

listen(win, "resize", () => {
  carouselSizeDirty = true;

  if (carouselResizeCall) carouselResizeCall.kill();
  carouselResizeCall = gsap.delayedCall(0.18, updateSetWidth);
}, { passive: true });

gsap.fromTo(section, {
  autoAlpha: 0,
  y: "3rem",
}, {
  autoAlpha: 1,
  y: 0,
  duration: 0.8,
  ease: "power3.out",
  scrollTrigger: {
    trigger: section,
    start: "top 90%",
    toggleActions: "play none none reverse",
  },
});

let draggable = null;
let momentumTween = null;
let lastDragX = 0;
let lastDragTime = 0;
let dragVelocity = 0;
let previousScroll = getScrollY();
const setTrackX = (x) => gsap.set(track, { x: wrapNegativeX(x, setWidth) });
const isDragging = () => carouselIsDragging || Boolean(draggable && draggable.isDragging);

const releaseMomentum = () => {
  const startX = Number(gsap.getProperty(track, "x")) || 0;
  const distance = dragVelocity * 0.34;
  const proxy = { progress: 0 };
  const duration = clamp(0.35, 1.8, Math.abs(dragVelocity) / 760);

  if (momentumTween) momentumTween.kill();

  momentumTween = gsap.to(proxy, {
    progress: 1,
    duration,
    ease: "power3.out",
    onUpdate() {
      setTrackX(startX + distance * proxy.progress);
    },
    onComplete() {
      if (draggable) draggable.update();
    },
  });
};

initExploreCardHovers(allCards, isDragging);

if (Draggable) {
  draggable = Draggable.create(track, {
    type: "x",
    trigger: mask,
    allowContextMenu: true,
    dragClickables: true,
    onPress() {
      carouselIsDragging = true;
      mask.classList.add("clt-state-dragging");

      if (carouselSizeDirty) updateSetWidth();
      if (momentumTween) momentumTween.kill();

      lastDragX = this.x;
      lastDragTime = performance.now();
      dragVelocity = 0;

      gsap.to(mask, {
        rotation: -1.15,
        duration: 0.22,
        ease: "power2.out",
        overwrite: true,
        force3D: true,
      });
    },
    onDrag() {
      const now = performance.now();
      const deltaX = this.x - lastDragX;
      const deltaTime = Math.max(16, now - lastDragTime);

      dragVelocity = (deltaX / deltaTime) * 1000;
      lastDragX = this.x;
      lastDragTime = now;

      const wrapped = wrapNegativeX(this.x, setWidth);
      if (Math.abs(wrapped - this.x) > 0.1) {
        gsap.set(track, { x: wrapped });
        this.update();
        lastDragX = wrapped;
      }
    },
    onRelease() {
      carouselIsDragging = false;
      mask.classList.remove("clt-state-dragging");

      gsap.to(mask, {
        rotation: 0,
        duration: 0.52,
        ease: "elastic.out(1, 0.55)",
        overwrite: true,
        force3D: true,
      });
    },
    onDragEnd: releaseMomentum,
  })[0];
}

const drift = () => {
  const scroll = getScrollY();
  const scrollDelta = scroll - previousScroll;
  previousScroll = scroll;

  const isDraggingNow = isDragging();
  const hasMomentum = momentumTween && momentumTween.isActive();

  if (isDraggingNow || hasMomentum) return;

  const currentX = Number(gsap.getProperty(track, "x")) || 0;
  const scrollPush = clamp(-18, 18, scrollDelta * 0.55);

  if (scrollPush !== 0) {
    setTrackX(currentX - scrollPush);
    if (draggable) draggable.update();
  }
};

gsap.ticker.add(drift);

cleanups.push(() => {
  gsap.ticker.remove(drift);
  if (carouselResizeCall) carouselResizeCall.kill();
  if (momentumTween) momentumTween.kill();
  if (draggable) draggable.kill();
  gsap.set(track, { clearProps: "transform" });
});

initExploreLens(mask, isDragging);

}

function initExploreCardHovers(cards, isCarouselDragging) {if (!cards.length || isTouch) return;

cards.forEach((card) => {
  const image = query(".clt-home-explore.is-card-img", card);
  const staticLayer = query(".clt-home-explore.is-card-static", card);
  const overlay = query(".clt-home-explore.is-card-overlay", card);
  const overlayInner = query(".clt-home-explore.is-card-overlay-inner", card);
  const overlayItems = queryAll(".clt-home-explore.is-card-desc, .clt-home-explore.is-card-sep, .clt-home-explore.is-card-meta", card);

  gsap.set(card, {
    scale: 0.95,
    filter: "brightness(0.7) saturate(0.82)",
    transformOrigin: "50% 50%",
    force3D: true,
  });

  gsap.set(image, {
    scale: 1.02,
    filter: "saturate(0.98) contrast(1)",
    transformOrigin: "50% 50%",
    force3D: true,
  });

  gsap.set(staticLayer, {
    y: 0,
    autoAlpha: 1,
    force3D: true,
  });

  gsap.set(overlay, {
    autoAlpha: 0,
    y: 18,
    force3D: true,
  });

  gsap.set(overlayInner, {
    autoAlpha: 0,
    y: 14,
    scale: 0.965,
    transformOrigin: "50% 100%",
    force3D: true,
  });

  gsap.set(overlayItems, {
    autoAlpha: 0,
    y: 8,
    force3D: true,
  });

  const hoverTimeline = gsap.timeline({
    paused: true,
    defaults: {
      ease: "power3.out",
      overwrite: "auto",
    },
  });

  hoverTimeline
    .to(card, {
      scale: 0.985,
      filter: "brightness(0.86) saturate(0.94)",
      duration: reducedMotion ? 0.01 : 0.34,
    }, 0)
    .to(image, {
      scale: 1.075,
      filter: "saturate(1.08) contrast(1.04)",
      duration: reducedMotion ? 0.01 : 0.62,
      ease: "power2.out",
    }, 0)
    .to(staticLayer, {
      y: -6,
      autoAlpha: 0.92,
      duration: reducedMotion ? 0.01 : 0.34,
    }, 0)
    .to(overlay, {
      autoAlpha: 1,
      y: 0,
      duration: reducedMotion ? 0.01 : 0.32,
    }, 0.04)
    .to(overlayInner, {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      duration: reducedMotion ? 0.01 : 0.44,
      ease: "expo.out",
    }, 0.06)
    .to(overlayItems, {
      autoAlpha: 1,
      y: 0,
      duration: reducedMotion ? 0.01 : 0.32,
      stagger: 0.035,
    }, 0.16);

  listen(card, "pointerenter", () => {
    if (isCarouselDragging && isCarouselDragging()) return;

    card.classList.add("clt-state-hovered");
    hoverTimeline.timeScale(1).play();
  }, { passive: true });

  listen(card, "pointerleave", () => {
    card.classList.remove("clt-state-hovered");
    hoverTimeline.timeScale(1.35).reverse();
  }, { passive: true });

  listen(card, "pointerdown", () => {
    card.classList.remove("clt-state-hovered");
    hoverTimeline.timeScale(1.65).reverse();
  }, { passive: true });

  cleanups.push(() => {
    hoverTimeline.kill();
  });
});

}

function initExploreLens(mask, isCarouselDragging) {const lens = query(SELECTOR.exploreLens);if (!lens || !mask || isTouch) return;

gsap.set(lens, {
  x: 0,
  y: 0,
  xPercent: -50,
  yPercent: -50,
  rotation: 0,
  scale: 0.82,
  autoAlpha: 0,
  pointerEvents: "none",
  zIndex: 9999,
  force3D: true,
});

const moveX = gsap.quickTo(lens, "x", { duration: 0.16, ease: "power3.out" });
const moveY = gsap.quickTo(lens, "y", { duration: 0.16, ease: "power3.out" });
const rotate = gsap.quickTo(lens, "rotation", { duration: 0.24, ease: "power3.out" });
const scale = gsap.quickTo(lens, "scale", { duration: 0.18, ease: "power3.out" });

let isOver = false;
let isDown = false;
let lastX = 0;

const show = () => {
  lens.classList.remove("clt-home-is-hidden");
  lens.classList.add("clt-state-visible");

  gsap.to(lens, {
    autoAlpha: 1,
    duration: reducedMotion ? 0.01 : 0.16,
    ease: "power2.out",
    overwrite: "auto",
  });

  scale(isDown ? 0.86 : 1);
};

const hide = () => {
  isOver = false;
  isDown = false;

  lens.classList.remove("clt-state-visible", "clt-state-dragging", "clt-home-is-hidden");
  rotate(0);
  scale(0.82);

  gsap.to(lens, {
    autoAlpha: 0,
    duration: reducedMotion ? 0.01 : 0.18,
    ease: "power2.out",
    overwrite: "auto",
  });
};

const move = (event) => {
  const deltaX = event.clientX - lastX;
  lastX = event.clientX;

  moveX(event.clientX);
  moveY(event.clientY);

  if (isOver && !(isCarouselDragging && isCarouselDragging())) {
    rotate(clamp(-10, 10, deltaX * 0.28));
  }
};

listen(mask, "pointerenter", (event) => {
  isOver = true;
  lastX = event.clientX;
  move(event);
  show();
}, { passive: true });

listen(mask, "pointermove", (event) => {
  if (!isOver) {
    isOver = true;
    show();
  }

  move(event);
}, { passive: true });

listen(mask, "pointerleave", hide, { passive: true });
listen(win, "blur", hide, { passive: true });

listen(mask, "pointerdown", (event) => {
  isDown = true;
  lens.classList.add("clt-state-dragging");
  move(event);
  show();
  scale(0.86);
  rotate(0);
}, { passive: true });

listen(win, "pointerup", () => {
  if (!isDown) return;

  isDown = false;
  lens.classList.remove("clt-state-dragging");

  if (isOver) {
    show();
  } else {
    hide();
  }
}, { passive: true });

}

function initLegalModals() {const termsButton = query(SELECTOR.termsButton);const privacyButton = query(SELECTOR.privacyButton);const termsModal = query(SELECTOR.termsModal);const privacyModal = query(SELECTOR.privacyModal);const modalPairs = [[termsButton, termsModal],[privacyButton, privacyModal],];

let activeModal = null;
let activeTimeline = null;
let lastFocusedElement = null;

const partsFor = (modal) => {
  const body = query(SELECTOR.legalBody, modal);

  return {
    panel: query(SELECTOR.legalPanel, modal),
    backdrop: query(SELECTOR.legalBackdrop, modal),
    header: query(SELECTOR.legalHeader, modal),
    title: query(SELECTOR.legalTitle, modal),
    close: query(SELECTOR.legalClose, modal),
    body,
    bodyChildren: body ? Array.from(body.children) : [],
  };
};

const prepareModal = (modal) => {
  if (!modal) return;

  const parts = partsFor(modal);

  modal.setAttribute("aria-hidden", "true");

  gsap.set(modal, {
    autoAlpha: 0,
    pointerEvents: "none",
  });

  gsap.set(parts.backdrop, {
    autoAlpha: 0,
    scale: 1.035,
  });

  gsap.set(parts.panel, {
    autoAlpha: 0,
    y: reducedMotion ? 0 : 34,
    scale: reducedMotion ? 1 : 0.94,
    rotateX: reducedMotion ? 0 : -7,
    transformOrigin: "50% 45%",
    filter: reducedMotion ? "none" : "blur(10px)",
  });

  gsap.set([parts.header, parts.title, parts.close].filter(Boolean), {
    autoAlpha: 0,
    y: reducedMotion ? 0 : -10,
  });

  gsap.set(parts.bodyChildren, {
    autoAlpha: 0,
    y: reducedMotion ? 0 : 18,
    filter: reducedMotion ? "none" : "blur(8px)",
  });
};

const stopPageScroll = () => {
  doc.documentElement.classList.add("clt-modal-is-open");
  doc.body.style.overflow = "hidden";

  if (lenis && typeof lenis.stop === "function") lenis.stop();
};

const startPageScroll = () => {
  doc.documentElement.classList.remove("clt-modal-is-open");
  doc.body.style.overflow = "";

  if (lenis && typeof lenis.start === "function") lenis.start();
};

const focusableIn = (modal) => {
  return queryAll(`${SELECTOR.legalClose}, .clt-button, a[href], button:not([disabled])`, modal)
    .filter((element) => element.offsetParent !== null || element === query(SELECTOR.legalClose, modal));
};

const openModal = (modal) => {
  if (!modal || modal === activeModal) return;

  if (activeModal) closeModal(activeModal, true);

  const parts = partsFor(modal);

  activeModal = modal;
  lastFocusedElement = doc.activeElement;

  if (activeTimeline) activeTimeline.kill();

  prepareModal(modal);
  stopPageScroll();

  modal.classList.add("clt-state-open", "clt-state-animating");
  modal.setAttribute("aria-hidden", "false");

  activeTimeline = gsap.timeline({
    defaults: { ease: "power3.out" },
    onComplete() {
      modal.classList.remove("clt-state-animating");

      if (parts.panel) {
        parts.panel.setAttribute("tabindex", "-1");
        parts.panel.focus({ preventScroll: true });
      }
    },
  });

  activeTimeline
    .set(modal, { pointerEvents: "auto" })
    .to(modal, {
      autoAlpha: 1,
      duration: reducedMotion ? 0.01 : 0.18,
    }, 0)
    .to(parts.backdrop, {
      autoAlpha: 1,
      scale: 1,
      duration: reducedMotion ? 0.01 : 0.42,
    }, 0)
    .to(parts.panel, {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      filter: "blur(0px)",
      duration: reducedMotion ? 0.01 : 0.62,
      ease: "expo.out",
    }, 0.06)
    .to([parts.header, parts.title, parts.close].filter(Boolean), {
      autoAlpha: 1,
      y: 0,
      duration: reducedMotion ? 0.01 : 0.36,
      stagger: 0.035,
    }, 0.2)
    .to(parts.bodyChildren, {
      autoAlpha: 1,
      y: 0,
      filter: "blur(0px)",
      duration: reducedMotion ? 0.01 : 0.48,
      stagger: 0.045,
    }, 0.28);
};

function closeModal(modal, instant) {
  if (!modal) return;

  const parts = partsFor(modal);

  if (activeTimeline) activeTimeline.kill();

  modal.classList.add("clt-state-animating");

  activeTimeline = gsap.timeline({
    defaults: { ease: "power2.inOut" },
    onComplete() {
      modal.classList.remove("clt-state-open", "clt-state-animating");
      modal.setAttribute("aria-hidden", "true");

      gsap.set(modal, {
        autoAlpha: 0,
        pointerEvents: "none",
      });

      activeModal = null;
      startPageScroll();

      if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
        lastFocusedElement.focus({ preventScroll: true });
      }

      lastFocusedElement = null;
    },
  });

  activeTimeline
    .to(parts.panel, {
      autoAlpha: 0,
      y: instant || reducedMotion ? 0 : 18,
      scale: instant || reducedMotion ? 1 : 0.965,
      rotateX: instant || reducedMotion ? 0 : 4,
      filter: instant || reducedMotion ? "none" : "blur(8px)",
      duration: instant || reducedMotion ? 0.01 : 0.26,
    }, 0)
    .to(parts.backdrop, {
      autoAlpha: 0,
      scale: instant || reducedMotion ? 1 : 1.02,
      duration: instant || reducedMotion ? 0.01 : 0.3,
    }, 0.04)
    .to(modal, {
      autoAlpha: 0,
      duration: instant || reducedMotion ? 0.01 : 0.26,
    }, 0.08);
}

[termsModal, privacyModal].filter(Boolean).forEach((modal) => {
  prepareModal(modal);

  queryAll(SELECTOR.legalCloseTrigger, modal).forEach((trigger) => {
    listen(trigger, "click", () => closeModal(modal));
  });
});

modalPairs.forEach(([button, modal]) => {
  if (!button || !modal) return;
  listen(button, "click", () => openModal(modal));
});

listen(win, "keydown", (event) => {
  if (event.key === "Escape" && activeModal) {
    closeModal(activeModal);
    return;
  }

  if (event.key !== "Tab" || !activeModal) return;

  const focusable = focusableIn(activeModal);
  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && doc.activeElement === first) {
    event.preventDefault();
    last.focus();
    return;
  }

  if (!event.shiftKey && doc.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

}

function refreshAfterLayoutSettles() {
  const refresh = () => {
    if (!ScrollTrigger || typeof ScrollTrigger.refresh !== "function") return;

    win.requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  };

  listen(win, "load", refresh, { once: true });

  if (doc.fonts && doc.fonts.ready) {
    doc.fonts.ready.then(refresh).catch(() => undefined);
  }

  win.setTimeout(refresh, 650);
}

function runCleanups() {
  while (cleanups.length) {
    const cleanup = cleanups.pop();

    try {
      cleanup();
    } catch (error) {
      console.warn("[home-clean.js] Cleanup failed.", error);
    }
  }
}

function performFullCleanup() {
  if (isCleaningUp) return;

  isCleaningUp = true;

  runCleanups();

  if (mainContext) {
    try {
      mainContext.revert();
    } catch (error) {
      console.warn("[home-clean.js] GSAP context revert failed.", error);
    }

    mainContext = null;
  }

  if (win.CLT_HOME_CLEANUP === performFullCleanup) {
    win.CLT_HOME_CLEANUP = null;
  }

  hasStarted = false;
  isCleaningUp = false;
}

function restoreFromPageCache() {
  if (lenis && typeof lenis.resize === "function") {
    lenis.resize();
  }

  if (ScrollTrigger && typeof ScrollTrigger.refresh === "function") {
    win.requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  }
}

function init() {
  if (hasStarted) return;

  hasStarted = true;

  activateGsapPlugins();

  gsap.defaults({ overwrite: "auto" });

  ScrollTrigger.config({
    ignoreMobileResize: true,
    autoRefreshEvents: isMobileLike
      ? "visibilitychange,DOMContentLoaded,load"
      : "visibilitychange,DOMContentLoaded,load,resize",
  });

  win.CLT_HOME_CLEANUP = performFullCleanup;

  const modules = [
    { name: "Lenis", init: initLenis },
    { name: "Mobile viewport lock", init: initMobileViewportLock },
    { name: "Hero pin guard", init: initHeroPinGuard },
    { name: "Hero canvas", init: initHeroCanvas },
    { name: "Reduced hero", init: showReducedHero, enabled: reducedMotion },
    { name: "Hero scrub", init: initHeroScrub, enabled: !reducedMotion },
    { name: "Curtain", init: initCurtain, enabled: !reducedMotion },
    { name: "Hero magnet", init: initHeroMagnet, enabled: !reducedMotion },
    { name: "Dust", init: initDust },
    { name: "Marquee", init: initMarquee },
    { name: "Explore carousel", init: initExploreCarousel },
    { name: "Legal modals", init: initLegalModals },
    { name: "Layout refresh", init: refreshAfterLayoutSettles },
  ];

  mainContext = gsap.context(() => {
    modules.forEach((module) => {
      if (module.enabled === false) return;

      try {
        module.init();
      } catch (error) {
        console.warn(`[home-clean.js] ${module.name} module failed.`, error);
      }
    });
  });

  listen(win, "pagehide", (event) => {
    if (event.persisted) return;
    performFullCleanup();
  }, { once: true });

  listen(win, "pageshow", (event) => {
    if (!event.persisted) return;
    restoreFromPageCache();
  });
}

function startWhenReady() {
  let attempts = 0;
  const maxAttempts = 90;

  const tryStart = () => {
    gsap = win.gsap;
    ScrollTrigger = win.ScrollTrigger;
    Draggable = win.Draggable;
    Lenis = win.Lenis;

    if (gsap && ScrollTrigger && Draggable) {
      activateGsapPlugins();
      init();
      return;
    }

    attempts += 1;

    if (attempts < maxAttempts) {
      win.setTimeout(tryStart, 50);
      return;
    }

    console.warn("[home-clean.js] GSAP, ScrollTrigger, or Draggable were not available before timeout.");
  };

  tryStart();
}

if (doc.readyState === "loading") {doc.addEventListener("DOMContentLoaded", startWhenReady, { once: true });} else {startWhenReady();}})();
