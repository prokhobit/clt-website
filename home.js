/* ============================================================
   Commonwealth Lyric Theater — home.js
   Webflow CDN build: GSAP/ScrollTrigger/Draggable/Lenis interactions
   ============================================================ */

(() => {
  "use strict";

  const win = window;
  const doc = document;
  const gsap = win.gsap;
  const ScrollTrigger = win.ScrollTrigger;
  const Draggable = win.Draggable;
  const Lenis = win.Lenis;

  if (!gsap || !ScrollTrigger) {
    console.warn("[home.js] GSAP and ScrollTrigger must load before home.js.");
    return;
  }

  const TITLE_REVEAL_AT = 0.841;
  const DUST_DENSITY = 1.32;
  const reducedMotion = win.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = win.matchMedia("(pointer: coarse)").matches;

  const FRAME_URLS = [
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a35ad19668aae30c2f4_frame-0001.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a35c6cbe27116ca83fd_frame-0002.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a35e5fb917b3701b693_frame-0003.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a35ea0f0eaf9849bc7d_frame-0004.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a353f53f75c4a4afc37_frame-0005.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a352b32486feac6ca3a_frame-0006.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3557c7ebe55cced14f_frame-0007.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a36c6cbe27116ca8413_frame-0008.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3599f0f4e3bce84ed8_frame-0009.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3576258272cd4cb6bd_frame-0010.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a35fd70d5f782392667_frame-0011.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a36bef6cbe7de7ee6be_frame-0012.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a360cf1cb07be8f575f_frame-0013.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a36af60118b3da98894_frame-0014.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a368bf83b4f96c0edc6_frame-0015.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a362ce081e1c2288a56_frame-0016.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a38c340810734eaf1bf_frame-0017.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a36cc037ef6b6ca93af_frame-0018.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3674a49421d8e64a51_frame-0019.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a37aaa45cd1f9ad9d3d_frame-0020.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a37b698f545445f3072_frame-0021.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a36fbe31da754432dd0_frame-0022.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3730e7ab983ff88785_frame-0023.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3791172a8381ba554b_frame-0024.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3712ed158393908b5b_frame-0025.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a371f30f5e609c6d713_frame-0026.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a37a443bb054c91a82a_frame-0027.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a37c2aefe6f66c49b9b_frame-0028.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a38d1a7c9294893e5ad_frame-0029.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a376c15ae5cf118aa6e_frame-0030.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a37ce07cea9e0f2bac7_frame-0031.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3848d6eac10c55faf1_frame-0032.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a387aebda0073e143c0_frame-0033.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3870ed7d5cbe1eeed9_frame-0034.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a391e118e4eb775798b_frame-0035.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a38d1a7c9294893e5cd_frame-0036.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a38bbf57eb4cbe6c2dd_frame-0037.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a396931768c599e07af_frame-0038.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a38d1a7c9294893e5b9_frame-0039.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3828e0ee0d39a276d2_frame-0040.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a38910e69bbb92c6f18_frame-0041.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a38ce07cea9e0f2bae9_frame-0042.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3996e6be40cc4675a8_frame-0043.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3954c45d626d87cafa_frame-0044.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3956dc0a5be159afca_frame-0045.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a39ea0f0eaf9849bcd8_frame-0047.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a39340140c4a507f230_frame-0048.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a39d1a7c9294893e5e2_frame-0049.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a39f727e166199c61bf_frame-0050.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3a30f205fd825e03a9_frame-0051.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3ae7587cb7254ee555_frame-0052.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3a07eed619dbb4e4aa_frame-0053.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3b0bb5b86c7d7069ef_frame-0054.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3bfd70d5f7823926b9_frame-0055.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3bc2816e961d9bc668_frame-0056.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3a1ece60cdf119ba33_frame-0057.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3b9e24e5bce33a63c6_frame-0058.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3bcbe6d89d3daa8e43_frame-0059.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3be7587cb7254ee569_frame-0060.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3bbe06050c80133155_frame-0061.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3b3906db07ec1bd079_frame-0062.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3cb58dc8cd882f2091_frame-0063.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3cc2aefe6f66c49c25_frame-0064.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3c3e5bc3f756bfb835_frame-0065.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3c1bc4b4982343ffdb_frame-0066.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3ca38bfb58b2618bbc_frame-0067.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3c3a6b8e8e1cea69e9_frame-0068.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3c72a900ff71000f61_frame-0069.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3cb9ce81d003e85c5a_frame-0070.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3c54c45d626d87cb63_frame-0071.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3dce07cea9e0f2bb35_frame-0072.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3dbef6cbe7de7ee728_frame-0073.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3d0f84346383459460_frame-0074.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3dcb137bad351d487d_frame-0075.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3d742c9dd58f1df76c_frame-0076.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3dcc037ef6b6ca9448_frame-0077.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3df15f0eb7499d378e_frame-0078.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3d4b92169c2c0ba4be_frame-0079.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3d1b20876355f37c47_frame-0080.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3d3906db07ec1bd08e_frame-0081.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3ec6e6531097d64768_frame-0082.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3e63bfbec4c46c714b_frame-0083.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3e2d31e03478434f1e_frame-0084.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3ea023cdced8eb993b_frame-0085.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3e91172a8381ba55cc_frame-0086.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3ea29e11ad6e988c81_frame-0087.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3fe61bcab7a436e274_frame-0088.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3f660858e96979de86_frame-0089.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3fbeddd5210b82822a_frame-0090.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3f43a6cb4ab827ff62_frame-0091.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3fc2816e961d9bc733_frame-0092.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3fe9f1e0b11f7ce49c_frame-0093.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a40275a8625e03cd6bd_frame-0094.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a40b93bb0732bfef0f0_frame-0095.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a403fa1e48ae3cc8e9d_frame-0096.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a403ece741832a8219d_frame-0097.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a40799dcbece37c4110_frame-0098.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a40efb8cf1031cd4afc_frame-0099.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a401ece60cdf119badd_frame-0100.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a405bb8e98d36d644ad_frame-0101.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a40eb145601d076419a_frame-0102.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a41567b702dcc3d18c5_frame-0103.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a415c8f8a44d977465b_frame-0104.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4101b6f40d2d832ce2_frame-0105.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a412716fe8617142b0c_frame-0106.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a419e24e5bce33a6417_frame-0108.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a410b10dc7360c90f97_frame-0109.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a414f739c84981cf04e_frame-0110.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a426ce43654e71c9fe3_frame-0111.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a42aaa45cd1f9ad9d8b_frame-0112.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a423a6b8e8e1cea6a77_frame-0113.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4239fdaf7c92706366_frame-0114.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4256c809384381bc44_frame-0115.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a42d1d4e5bc375da69b_frame-0116.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a423ab3744c2a5c486e_frame-0117.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a42f15f0eb7499d37d9_frame-0118.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a43097e3e4f6ec78770_frame-0119.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4311f0be990734fe7d_frame-0120.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a434f739c84981cf062_frame-0121.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a438e705fb40c09299a_frame-0122.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a43841c442b7016d945_frame-0123.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a43364b0a4d8f785569_frame-0124.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a44d26c1f6fe0bc00c7_frame-0125.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a442afaaee3a2663941_frame-0126.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a44751b23bd914ded02_frame-0127.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a44354572db1da09f19_frame-0128.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a444cfa5c5e15ebbb08_frame-0129.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4476258272cd4cb7cc_frame-0130.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a44099f73df0a6a1297_frame-0131.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a448560082423df8d4e_frame-0132.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a449f6c144ad82daa4f_frame-0133.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a45b6f436467f3736c9_frame-0134.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a45beddd5210b82827e_frame-0135.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a45f8c75d10e4359658_frame-0136.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a45249b5c83297f9444_frame-0137.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4592546979db11319d_frame-0138.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a45f2d8d4ac76520426_frame-0139.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4688f202d72a9fea0a_frame-0140.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a468e705fb40c0929c8_frame-0141.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a455db0694214a74552_frame-0142.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a46567b702dcc3d19db_frame-0143.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a46e5b9a26605a9332d_frame-0144.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a46be06050c801332a6_frame-0145.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a46cc335f46dab0df83_frame-0146.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4bb6f436467f3738ae_frame-0147.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a47d26c1f6fe0bc0271_frame-0148.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a46d26c1f6fe0bc0256_frame-0149.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a46eb99db6c549dfb21_frame-0150.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a471e118e4eb7757a62_frame-0151.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a49066d8e822f42d252_frame-0152.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4bedb4722c99c8e975_frame-0153.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4a8f89be046ed0446e_frame-0154.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4991172a8381ba5628_frame-0155.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4a6ef070f7aa731534_frame-0156.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4a9e7ac4761ba9767c_frame-0157.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a47fd70d5f7823926ff_frame-0158.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4a1bc4b49823440090_frame-0159.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4a0ec24e311b11db66_frame-0160.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4a61d2a6be196c5a23_frame-0161.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4bc7c37d65ad906ddf_frame-0162.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4b8acd6bf9b7adb804_frame-0163.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4aeb145601d0764222_frame-0164.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4bfc1775799f12ab0d_frame-0165.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4a0e9889939b999acf_frame-0166.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4bed275c6736f03f0c_frame-0167.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4bf4e0e9b9731a75df_frame-0168.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4c30e7ab983ff88c52_frame-0169.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4c20785b9922af78d2_frame-0171.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4ccfebf91f245697cd_frame-0172.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4c1e87e0cf21b3e4e0_frame-0173.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4c604992735e1f1b0b_frame-0174.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4c4cb1e12be394d4f2_frame-0175.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4cdc1e72c50e3a0b50_frame-0176.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4dfe52ab7f12cf51da_frame-0177.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4d1ece60cdf119bb26_frame-0178.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4d0d8e45c8af33651a_frame-0179.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4d74a49421d8e64c3a_frame-0180.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4e679f5b8f26d68ad2_frame-0181.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4e8560082423df8e23_frame-0182.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4ece07cea9e0f2bc2f_frame-0183.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4f8bc2eb5ae2f2c9b8_frame-0184.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4fcdeeffc95f29c717_frame-0185.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4e20785b9922af7913_frame-0186.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4ecfebf91f245699bb_frame-0187.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4ef3ad3ca4178970a9_frame-0188.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4ef727a538f3c5d9c4_frame-0189.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4f4edbae5dd4552f1c_frame-0190.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4fa29e11ad6e988dc1_frame-0193.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4f275a8625e03cd768_frame-0194.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4fe01d7dadb6eeffd3_frame-0195.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4fefb8cf1031cd4bd8_frame-0196.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4fb5748c2ba0caec76_frame-0197.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a50995f71e13063b0dd_frame-0198.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a50354572db1da09fab_frame-0199.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a50099f73df0a6a13e5_frame-0200.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a50751b23bd914ded9f_frame-0201.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a50567b702dcc3d1a58_frame-0202.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a509427ff4537867863_frame-0203.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a511ece60cdf119bb86_frame-0204.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a51fe52ab7f12cf51fa_frame-0205.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a51dc1e72c50e3a0ca2_frame-0206.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a5128e0ee0d39a278ef_frame-0207.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a51c6e6531097d64a89_frame-0208.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a5149461c37f719138a_frame-0209.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a5120785b9922af7960_frame-0210.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a5233023d85dc4e741a_frame-0211.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4688ffe7ca32af0fd6_frame-0212.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a473f53f75c4a4afd84_frame-0213.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a47c7c37d65ad906dad_frame-0214.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a470e9889939b999a90_frame-0215.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a47f72a9a028dcc066e_frame-0216.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a48f4eec82dd5e0fbb0_frame-0217.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a48dc1e72c50e3a0b1c_frame-0218.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a484314e618440c4ea6_frame-0219.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a483fa1e48ae3cc8ef1_frame-0220.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a481945969ab35e4870_frame-0221.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a48a7df565953258c13_frame-0222.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4807eed619dbb4e63e_frame-0223.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a48f72a9a028dcc0684_frame-0224.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a48c0d305bf40ce7331_frame-0225.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a484314e618440c4ecd_frame-0226.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a498560082423df8d92_frame-0227.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a491945969ab35e488b_frame-0228.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a52f4e0e9b9731a7607_frame-0229.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a52424ba9e393c7d238_frame-0230.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a52a38bfb58b2618ca5_frame-0231.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a521ece60cdf119bbb5_frame-0232.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a523f53f75c4a4aff7c_frame-0234.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a536ef070f7aa73158f_frame-0235.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a533ab3744c2a5c48e8_frame-0236.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a539ef94c938cf07c5d_frame-0237.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a53046ae8dbd4712dd3_frame-0238.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a53d31334c4f81020d6_frame-0239.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a5310ab427d2ebf3e02_frame-0240.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a5396e6be40cc4676ed_frame-0241.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a538fe44dc6b4f58026_frame-0242.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a5307eed619dbb4e6ca_frame-0243.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a530b10dc7360c910d4_frame-0244.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a5402b663b89be2543f_frame-0245.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a541f30f5e609c6d8b1_frame-0246.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a54e1517a752ec189bc_frame-0247.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a540030b57ecf440576_frame-0248.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a54f29cfaca54deb5e2_frame-0249.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a54f4eec82dd5e0fca3_frame-0250.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a490f84346383459580_frame-0251.avif",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4b7666c90470b4e1f4_frame-0252.avif",
  ];

  const FRAME_COUNT = FRAME_URLS.length;
  const clamp = gsap.utils.clamp;
  const random = gsap.utils.random;
  const toArray = gsap.utils.toArray;

  let lenis = null;
  let mainCtx = null;
  let canvas = null;
  let canvasContext = null;
  let resizeObserver = null;
  let frames = new Array(FRAME_COUNT);
  let framePromises = new Array(FRAME_COUNT);
  let currentFrameIndex = 0;
  let titleRevealed = false;
  let lastKnownScroll = 0;
  let lastKnownVelocity = 0;
  let refreshTimer = 0;

  const $ = (selector, scope = doc) => scope.querySelector(selector);
  const $$ = (selector, scope = doc) => Array.from(scope.querySelectorAll(selector));

  function addEvent(target, type, handler, options) {
    if (!target || !target.addEventListener) return () => {};
    target.addEventListener(type, handler, options);
    return () => target.removeEventListener(type, handler, options);
  }

  function getScrollY() {
    if (lenis && typeof lenis.scroll === "number") return lenis.scroll;
    return win.scrollY || doc.documentElement.scrollTop || 0;
  }

  function requestRefresh(delay = 80) {
    win.clearTimeout(refreshTimer);
    refreshTimer = win.setTimeout(() => ScrollTrigger.refresh(), delay);
  }

  function refreshWhenLayoutSettles() {
    requestRefresh(120);

    addEvent(win, "load", () => requestRefresh(60), { once: true });

    if (doc.fonts && doc.fonts.ready) {
      doc.fonts.ready.then(() => requestRefresh(40)).catch(() => {});
    }

    Array.from(doc.images || []).forEach((image) => {
      if (image.complete) return;
      addEvent(image, "load", () => requestRefresh(40), { once: true });
      addEvent(image, "error", () => requestRefresh(40), { once: true });
    });
  }

  /* ── Lenis smooth scroll ─────────────────────────────────── */

  function initLenis() {
    if (reducedMotion || !Lenis) return;

    lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.25,
      infinite: false,
    });

    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    lenis.on("scroll", (event) => {
      lastKnownScroll = typeof event.scroll === "number" ? event.scroll : getScrollY();
      lastKnownVelocity = typeof event.velocity === "number" ? event.velocity : 0;
      ScrollTrigger.update();
    });

    mainCtx.add(() => () => {
      gsap.ticker.remove(tick);
      if (lenis && typeof lenis.destroy === "function") lenis.destroy();
      lenis = null;
    });
  }

  /* ── Canvas frame player ─────────────────────────────────── */

  function frameSrc(index) {
    return FRAME_URLS[index] || FRAME_URLS[0];
  }

  function loadFrame(index) {
    if (index < 0 || index >= FRAME_COUNT) return Promise.resolve(null);
    if (frames[index]) return Promise.resolve(frames[index]);
    if (framePromises[index]) return framePromises[index];

    framePromises[index] = new Promise((resolve) => {
      const image = new Image();
      image.decoding = "async";
      image.onload = () => {
        frames[index] = image;
        resolve(image);
      };
      image.onerror = () => resolve(null);
      image.src = frameSrc(index);
    });

    return framePromises[index];
  }

  function warmFrameCache() {
    if (!FRAME_COUNT) return;

    loadFrame(0).then(() => drawFrame(0));

    const order = [];
    for (let i = 1; i < FRAME_COUNT; i += 1) order.push(i);

    let pointer = 0;
    const batchSize = 8;

    function loadBatch() {
      const batch = order.slice(pointer, pointer + batchSize);
      pointer += batchSize;

      batch.forEach((index) => {
        loadFrame(index).then((image) => {
          if (image && Math.abs(index - currentFrameIndex) <= 1) drawFrame(currentFrameIndex);
        });
      });

      if (pointer < order.length) {
        win.setTimeout(loadBatch, 90);
      } else {
        requestRefresh(120);
      }
    }

    loadBatch();
  }

  function nearestLoadedFrame(index) {
    if (frames[index]) return index;

    for (let offset = 1; offset < FRAME_COUNT; offset += 1) {
      const before = index - offset;
      const after = index + offset;
      if (before >= 0 && frames[before]) return before;
      if (after < FRAME_COUNT && frames[after]) return after;
    }

    return -1;
  }

  function drawFrame(index) {
    if (!canvas || !canvasContext) return;

    const requestedIndex = clamp(0, FRAME_COUNT - 1, Math.round(index));
    currentFrameIndex = requestedIndex;

    if (!frames[requestedIndex]) {
      loadFrame(requestedIndex).then(() => drawFrame(currentFrameIndex));
    }

    const drawableIndex = nearestLoadedFrame(requestedIndex);
    if (drawableIndex < 0) return;

    const image = frames[drawableIndex];
    if (!image || !image.naturalWidth || !image.naturalHeight) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const scale = Math.max(canvasWidth / image.naturalWidth, canvasHeight / image.naturalHeight);
    const width = image.naturalWidth * scale;
    const height = image.naturalHeight * scale;

    canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
    canvasContext.drawImage(image, (canvasWidth - width) / 2, (canvasHeight - height) / 2, width, height);
  }

  function resizeCanvas() {
    if (!canvas || !canvasContext) return;

    const dpr = Math.min(win.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width * dpr));
    const height = Math.max(1, Math.round(rect.height * dpr));

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    drawFrame(currentFrameIndex);
  }

  function initHeroCanvas() {
    canvas = $("#hero-canvas");
    if (!canvas) return;

    canvasContext = canvas.getContext("2d", { alpha: false });
    if (!canvasContext) return;

    resizeCanvas();

    if ("ResizeObserver" in win) {
      resizeObserver = new ResizeObserver(() => resizeCanvas());
      resizeObserver.observe(canvas);
      mainCtx.add(() => () => resizeObserver.disconnect());
    } else {
      const removeResize = addEvent(win, "resize", resizeCanvas, { passive: true });
      mainCtx.add(() => removeResize);
    }

    warmFrameCache();
  }

  /* ── Scroll scrub — drives canvas frame index ────────────── */

  function initScrollScrub() {
    const heroPin = $('[data-gsap="home-hero-pin"]');
    if (!heroPin || !canvas) return;

    mainCtx.add(() => {
      ScrollTrigger.create({
        trigger: heroPin,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate(self) {
          drawFrame(self.progress * (FRAME_COUNT - 1));

          if (!titleRevealed && self.progress >= TITLE_REVEAL_AT) {
            titleRevealed = true;
            revealTitle();
          }
        },
      });
    });
  }

  /* ── Title reveal — stagger-in overlay ───────────────────── */

  function revealTitle() {
    const eyebrow = $('[data-gsap="home-hero-eyebrow"]');
    const lines = $$('[data-gsap="home-hero-line"]');
    const cta = $('[data-gsap="home-hero-cta"]');
    const reveal = $('[data-gsap="home-hero-reveal"]');
    const targets = [eyebrow, ...lines, cta].filter(Boolean);

    if (!targets.length) return;

    gsap.timeline({
      defaults: { ease: "power2.out" },
      onComplete() {
        if (reveal) reveal.style.pointerEvents = "auto";
        if (cta) cta.style.pointerEvents = "auto";
      },
    })
      .to(eyebrow, { opacity: 1, y: 0, duration: 0.55 })
      .to(lines, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }, "-=0.24")
      .to(cta, { opacity: 1, y: 0, duration: 0.55 }, "-=0.22");
  }

  function showReducedHero() {
    loadFrame(0).then(() => drawFrame(0));

    $$('[data-gsap="home-hero-line"], [data-gsap="home-hero-eyebrow"], [data-gsap="home-hero-cta"]').forEach((element) => {
      gsap.set(element, { opacity: 1, y: 0, clearProps: "transform" });
    });

    const reveal = $('[data-gsap="home-hero-reveal"]');
    const cta = $('[data-gsap="home-hero-cta"]');
    const stage = $('[data-gsap="home-curtain-stage"]');

    if (reveal) reveal.style.pointerEvents = "auto";
    if (cta) cta.style.pointerEvents = "auto";
    if (stage) stage.style.display = "none";
  }

  /* ── Curtain — fold injection + scroll open ──────────────── */

  function initCurtain() {
    const left = $("#clt-home-curtain-left");
    const right = $("#clt-home-curtain-right");
    const stage = $('[data-gsap="home-curtain-stage"]');
    if (!left || !right || !stage) return;

    const foldConfig = [
      { el: left, folds: [
        { cls: "deep", left: "6%", anim: "curtain-fold-a", dur: "6.8s", delay: "0.0s" },
        { cls: "shallow", left: "14%", anim: "curtain-fold-b", dur: "7.5s", delay: "0.8s" },
        { cls: "deep", left: "23%", anim: "curtain-fold-c", dur: "6.2s", delay: "1.6s" },
        { cls: "shallow", left: "32%", anim: "curtain-fold-d", dur: "7.0s", delay: "0.4s" },
        { cls: "deep", left: "43%", anim: "curtain-fold-e", dur: "6.5s", delay: "1.2s" },
        { cls: "shallow", left: "53%", anim: "curtain-fold-b", dur: "7.2s", delay: "0.6s" },
        { cls: "deep", left: "63%", anim: "curtain-fold-a", dur: "6.4s", delay: "1.8s" },
        { cls: "shallow", left: "72%", anim: "curtain-fold-d", dur: "7.4s", delay: "1.0s" },
        { cls: "deep", left: "82%", anim: "curtain-fold-c", dur: "6.6s", delay: "0.2s" },
        { cls: "shallow", left: "91%", anim: "curtain-fold-e", dur: "7.1s", delay: "1.4s" },
      ] },
      { el: right, folds: [
        { cls: "shallow", left: "5%", anim: "curtain-fold-c", dur: "7.0s", delay: "0.5s" },
        { cls: "deep", left: "14%", anim: "curtain-fold-e", dur: "6.3s", delay: "1.3s" },
        { cls: "shallow", left: "22%", anim: "curtain-fold-a", dur: "7.6s", delay: "0.9s" },
        { cls: "deep", left: "32%", anim: "curtain-fold-d", dur: "6.1s", delay: "0.1s" },
        { cls: "shallow", left: "42%", anim: "curtain-fold-b", dur: "7.3s", delay: "1.7s" },
        { cls: "deep", left: "52%", anim: "curtain-fold-c", dur: "6.7s", delay: "0.7s" },
        { cls: "shallow", left: "62%", anim: "curtain-fold-e", dur: "7.5s", delay: "1.5s" },
        { cls: "deep", left: "73%", anim: "curtain-fold-a", dur: "6.0s", delay: "0.3s" },
        { cls: "shallow", left: "83%", anim: "curtain-fold-d", dur: "7.2s", delay: "1.1s" },
        { cls: "deep", left: "92%", anim: "curtain-fold-b", dur: "6.9s", delay: "0.6s" },
      ] },
    ];

    foldConfig.forEach((group) => {
      if (group.el.querySelector('[data-generated="home-curtain-fold"]')) return;

      group.folds.forEach((fold) => {
        const element = doc.createElement("div");
        element.className = `clt-home-curtain fold ${fold.cls}`;
        element.dataset.generated = "home-curtain-fold";
        element.style.left = fold.left;
        element.style.animation = `${fold.anim} ${fold.dur} ${fold.delay} ease-in-out infinite alternate`;

        const panelTop = group.el.querySelector('[data-gsap="home-curtain-panel-top"]');
        group.el.insertBefore(element, panelTop || null);
      });
    });

    const prompt = $('[data-gsap="home-curtain-prompt"]');
    const heroPin = $('[data-gsap="home-hero-pin"]');

    mainCtx.add(() => {
      ScrollTrigger.create({
        trigger: heroPin,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate(self) {
          const openEnd = 0.12;
          const rawProgress = Math.min(self.progress / openEnd, 1);
          const eased = 1 - Math.pow(1 - rawProgress, 2.8);
          const travel = eased * 110;
          const gather = 1 - eased * 0.28;
          const sway = Math.sin(rawProgress * Math.PI) * 3.5;

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

          if (prompt && self.progress > 0.003) {
            gsap.set(prompt, { opacity: Math.max(0, 1 - rawProgress * 5) });
          }

          stage.style.visibility = rawProgress >= 1 ? "hidden" : "visible";
        },
      });
    });
  }

  /* ── Ambient dust particles ──────────────────────────────── */

  function initDust() {
    const far = $("#dust-far");
    const mid = $("#dust-mid");
    const near = $("#dust-near");
    const root = $("#star-container");
    if (!far && !mid && !near) return;

    const containers = [far, mid, near].filter(Boolean);
    containers.forEach((container) => {
      $$(".clt-home-dust.particle", container).forEach((particle) => particle.remove());
    });

    const density = reducedMotion ? 0.45 : DUST_DENSITY;
    const tones = ["warm", "warm", "warm", "brass", "brass", "cool"];
    const stars = [];
    const wrapPercent = gsap.utils.wrap(0, 100);

    function spawn(container, count, minSize, maxSize, depth) {
      if (!container) return;

      const fragment = doc.createDocumentFragment();
      const total = Math.round(count * density);

      for (let i = 0; i < total; i += 1) {
        const element = doc.createElement("div");
        const tone = tones[Math.floor(Math.random() * tones.length)];
        const size = random(minSize, maxSize);
        const baseX = random(0, 100);
        const baseY = random(0, 100);

        element.className = `clt-home-dust particle ${tone}`;
        element.style.width = `${size}px`;
        element.style.height = `${size}px`;
        element.style.left = `${baseX}%`;
        element.style.top = `${baseY}%`;
        element.style.willChange = "transform, top, opacity";
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
          pointerX: 0,
          pointerY: 0,
          setCss: null,
        };

        star.setCss = gsap.quickSetter(element, "css");

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
    }

    spawn(far, 46, 1.0, 2.0, 0.45);
    spawn(mid, 31, 1.3, 2.8, 0.78);
    spawn(near, 18, 1.8, 3.6, 1.15);

    if (reducedMotion || !stars.length) return;

    let lastScroll = getScrollY();
    let scrollImpulse = 0;
    let pointerImpulseX = 0;
    let pointerImpulseY = 0;
    let lastPointerX = 0;
    let lastPointerY = 0;
    let hasPointer = false;

    const removePointerMove = isTouch ? () => {} : addEvent(win, "pointermove", (event) => {
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
      lastScroll = scroll;

      const velocity = lenis ? lastKnownVelocity * 1000 : scrollDelta * 60;
      scrollImpulse += clamp(-90, 90, scrollDelta);

      stars.forEach((star) => {
        const parallaxTop = wrapPercent(star.baseY - scroll * 0.0065 * star.depth);
        const targetInertiaY = -scrollImpulse * 0.085 * star.depth;
        const targetInertiaX = pointerImpulseX * 0.08 * star.depth;
        const targetPointerY = pointerImpulseY * 0.035 * star.depth;

        star.inertiaY += (targetInertiaY + targetPointerY - star.inertiaY) * 0.11;
        star.inertiaX += (targetInertiaX - star.inertiaX) * 0.09;
        star.pointerY += (targetPointerY - star.pointerY) * 0.08;

        const stretch = clamp(1, 1.72, 1 + (Math.abs(velocity) / 4200) * 0.48 * star.depth);
        const rotate = clamp(-14, 14, (scrollDelta * 0.08 + pointerImpulseX * 0.05) * star.depth);

        star.element.style.top = `${parallaxTop}%`;
        star.setCss({
          x: star.floatX + star.inertiaX,
          y: star.floatY + star.inertiaY + star.pointerY,
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

    mainCtx.add(() => {
      if (root && far) {
        gsap.to(far, {
          y: 70,
          ease: "none",
          scrollTrigger: {
            trigger: ".clt-page",
            start: "top top",
            end: "bottom bottom",
            scrub: 1.3,
            invalidateOnRefresh: true,
          },
        });
      }

      if (root && mid) {
        gsap.to(mid, {
          y: -130,
          ease: "none",
          scrollTrigger: {
            trigger: ".clt-page",
            start: "top top",
            end: "bottom bottom",
            scrub: 1.5,
            invalidateOnRefresh: true,
          },
        });
      }

      if (root && near) {
        gsap.to(near, {
          y: -260,
          ease: "none",
          scrollTrigger: {
            trigger: ".clt-page",
            start: "top top",
            end: "bottom bottom",
            scrub: 1.8,
            invalidateOnRefresh: true,
          },
        });
      }

      return () => {
        gsap.ticker.remove(ticker);
        removePointerMove();
      };
    });
  }

  /* ── Section parallax ────────────────────────────────────── */

  function initSectionParallax() {
    const sections = $$('[data-gsap~="home-section"]');
    if (!sections.length) return;

    mainCtx.add(() => {
      sections.forEach((section) => {
        const kicker = $(".clt-eyebrow", section);
        const title = $(".clt-home-explore.title, .clt-home-upcoming.title, .clt-home-past.title, .clt-home-subscribe.title", section);
        const subtitle = $(".clt-home-upcoming.subtitle, .clt-home-past.subtitle, .clt-home-subscribe.desc", section);

        if (kicker) {
          gsap.fromTo(kicker, { y: 30, opacity: 0 }, {
            y: 0,
            opacity: 1,
            ease: "none",
            immediateRender: false,
            scrollTrigger: {
              trigger: section,
              start: "top 88%",
              end: "top 55%",
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          });
        }

        if (title) {
          gsap.fromTo(title, { y: 50, opacity: 0, scale: 0.97 }, {
            y: 0,
            opacity: 1,
            scale: 1,
            ease: "none",
            immediateRender: false,
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              end: "top 50%",
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          });
        }

        if (subtitle) {
          gsap.fromTo(subtitle, { y: 25, opacity: 0 }, {
            y: 0,
            opacity: 1,
            ease: "none",
            immediateRender: false,
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              end: "top 48%",
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          });
        }
      });

      $$('[data-gsap~="home-bloom"]').forEach((bloom, index) => {
        gsap.to(bloom, {
          y: (index % 2 === 0 ? 1 : -1) * 80,
          ease: "none",
          scrollTrigger: {
            trigger: ".clt-page",
            start: "top top",
            end: "bottom bottom",
            scrub: 1.2,
            invalidateOnRefresh: true,
          },
        });
      });
    });
  }

  /* ── Marquee — scroll-direction aware ────────────────────── */

  function initMarquee() {
    const track = $(".clt-home-marquee.track");
    const section = $('[data-webflow-section="acclaim-marquee"]');
    const firstSet = $(".clt-home-marquee.set", track || doc);
    if (!track || !section || !firstSet) return;

    track.style.animation = "none";

    mainCtx.add(() => {
      const getSetWidth = () => Math.max(1, firstSet.getBoundingClientRect().width);
      let setWidth = getSetWidth();

      const marqueeTween = gsap.to(track, {
        x: () => -setWidth,
        duration: 40,
        ease: "none",
        repeat: -1,
        modifiers: {
          x: (value) => `${parseFloat(value) % -setWidth}px`,
        },
      });

      const refreshWidth = () => {
        setWidth = getSetWidth();
        marqueeTween.invalidate();
      };

      const removeEnter = addEvent(section, "mouseenter", () => {
        gsap.to(marqueeTween, { timeScale: 0.3, duration: 0.45, overwrite: true });
      });

      const removeLeave = addEvent(section, "mouseleave", () => {
        gsap.to(marqueeTween, { timeScale: 1, duration: 0.45, overwrite: true });
      });

      const removeResize = addEvent(win, "resize", refreshWidth, { passive: true });

      ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        onUpdate(self) {
          const velocity = Math.min(Math.abs(self.getVelocity()) / 2500, 4);
          gsap.to(marqueeTween, {
            timeScale: self.direction * Math.max(1, velocity),
            duration: 0.45,
            overwrite: true,
          });
        },
      });

      return () => {
        removeEnter();
        removeLeave();
        removeResize();
        marqueeTween.kill();
      };
    });
  }

  /* ── Explore — infinite draggable carousel ───────────────── */

  function initExploreCarousel() {
    const section = $("#education");
    const track = $("#explore-track");
    const trackMask = $("#explore-mask");
    if (!section || !track || !trackMask) return;

    const originalCards = $$(".clt-home-explore.card", track).filter((card) => card.dataset.clone !== "true");
    if (!originalCards.length) return;

    if (!track.dataset.clonesReady) {
      originalCards.forEach((card) => {
        const clone = card.cloneNode(true);
        clone.dataset.clone = "true";
        clone.setAttribute("aria-hidden", "true");
        track.appendChild(clone);
      });
      track.dataset.clonesReady = "true";
    }

    mainCtx.add(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top 95%",
        end: "top 20%",
        toggleActions: "play none none reverse",
        onEnter: () => gsap.to(section, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }),
        onLeaveBack: () => gsap.to(section, { opacity: 0, y: 50, duration: 0.5, ease: "power2.in" }),
      });
    });

    let setWidth = 1;

    function calcSetWidth() {
      const gap = parseFloat(win.getComputedStyle(track).columnGap || win.getComputedStyle(track).gap) || 24;
      const cardsWidth = originalCards.reduce((total, card) => total + card.getBoundingClientRect().width, 0);
      return Math.max(1, cardsWidth + gap * originalCards.length);
    }

    function updateWidth() {
      setWidth = calcSetWidth();
    }

    function wrapX(x) {
      if (!setWidth) return 0;
      return ((x % -setWidth) + -setWidth) % -setWidth;
    }

    updateWidth();

    mainCtx.add(() => {
      const removeResize = addEvent(win, "resize", () => {
        updateWidth();
        const currentX = Number(gsap.getProperty(track, "x")) || 0;
        gsap.set(track, { x: wrapX(currentX) });
      }, { passive: true });

      return () => removeResize();
    });

    if (!Draggable) {
      initCarouselLens(trackMask, track);
      return;
    }

    let lastDragX = 0;
    let lastDragTime = 0;
    let dragVelocity = 0;
    let momentumTween = null;

    const draggable = Draggable.create(track, {
      type: "x",
      cursor: "none",
      edgeResistance: 0,
      dragClickables: true,
      inertia: false,
      onPress() {
        if (momentumTween) momentumTween.kill();
        updateWidth();
        lastDragX = this.x;
        lastDragTime = Date.now();
        gsap.to(trackMask, { rotation: -2.6, duration: 0.25, ease: "power2.out" });
      },
      onDrag() {
        const now = Date.now();
        const deltaTime = Math.max((now - lastDragTime) / 1000, 0.001);
        dragVelocity = (this.x - lastDragX) / deltaTime;
        lastDragX = this.x;
        lastDragTime = now;

        const wrapped = wrapX(this.x);
        if (Math.abs(wrapped - this.x) > 0.01) {
          gsap.set(track, { x: wrapped });
          this.update();
        }
      },
      onRelease() {
        gsap.to(trackMask, { rotation: -2, duration: 0.6, ease: "elastic.out(1, 0.5)" });
      },
      onDragEnd() {
        const distance = dragVelocity * 0.42;
        const startX = Number(gsap.getProperty(track, "x")) || 0;
        const proxy = { progress: 0 };
        const duration = clamp(0.35, 2.25, Math.abs(dragVelocity) / 640);

        momentumTween = gsap.to(proxy, {
          progress: 1,
          duration,
          ease: "power3.out",
          onUpdate() {
            gsap.set(track, { x: wrapX(startX + distance * proxy.progress) });
          },
          onComplete: () => draggable.update(),
        });
      },
    })[0];

    initCarouselLens(trackMask, track);

    mainCtx.add(() => {
      let previousScroll = getScrollY();

      const ticker = () => {
        const currentScroll = getScrollY();
        const delta = currentScroll - previousScroll;
        previousScroll = currentScroll;

        if (draggable.isDragging) return;
        if (momentumTween && momentumTween.isActive()) return;
        if (Math.abs(delta) < 0.5) return;

        const currentX = Number(gsap.getProperty(track, "x")) || 0;
        gsap.set(track, { x: wrapX(currentX - delta * 1.25) });
        draggable.update();
      };

      gsap.ticker.add(ticker);

      return () => {
        gsap.ticker.remove(ticker);
        if (momentumTween) momentumTween.kill();
        draggable.kill();
        gsap.set(track, { clearProps: "transform" });
      };
    });
  }

  /* ── Carousel lens — custom cursor ───────────────────────── */

  function initCarouselLens(trackMask, track) {
    const lens = $("#clt-home-carousel-lens");
    if (!lens || isTouch) return;

    const moveX = gsap.quickTo(lens, "left", { duration: 0.12, ease: "power2.out" });
    const moveY = gsap.quickTo(lens, "top", { duration: 0.12, ease: "power2.out" });

    let isOverTrack = false;
    let isDragging = false;

    function update() {
      lens.classList.remove("clt-state-visible", "clt-home-is-hidden", "clt-state-dragging");

      if (!isOverTrack) return;

      lens.classList.add("clt-state-visible");
      if (isDragging) lens.classList.add("clt-state-dragging");
    }

    mainCtx.add(() => {
      const cleanups = [
        addEvent(trackMask, "mouseenter", () => { isOverTrack = true; update(); }),
        addEvent(trackMask, "mouseleave", () => { isOverTrack = false; isDragging = false; update(); }),
        addEvent(trackMask, "mousemove", (event) => { moveX(event.clientX); moveY(event.clientY); }, { passive: true }),
        addEvent(trackMask, "mousedown", () => { isDragging = true; update(); }),
        addEvent(win, "mouseup", () => { if (isDragging) { isDragging = false; update(); } }),
      ];

      $$(".clt-home-explore.card", track).forEach((card) => {
        cleanups.push(addEvent(card, "mouseenter", update));
        cleanups.push(addEvent(card, "mouseleave", update));
      });

      return () => cleanups.forEach((cleanup) => cleanup());
    });
  }

  /* ── Upcoming events — entrance + mouse-tracking parallax ── */

  function initUpcomingEvents() {
    const section = $("#season");
    const posterWrap = $("#upcoming-poster-wrap");
    const poster = $("#upcoming-poster");
    if (!section || !posterWrap || !poster) return;

    const header = $(".clt-home-upcoming.header", section);
    const posterGlow = $(".clt-home-upcoming.poster-glow", section);
    const descriptors = $$(".clt-home-upcoming.descriptor", section);
    const events = $$(".clt-home-upcoming.event", section);
    const sep = $(".clt-home-upcoming.sep", section);
    const scheduleHeading = $(".clt-home-upcoming.schedule-heading", section);

    mainCtx.add(() => {
      const entranceTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 82%",
          end: "top 20%",
          toggleActions: "play none none reverse",
          invalidateOnRefresh: true,
        },
      });

      entranceTl
        .from(header, { opacity: 0, y: 30, duration: 0.6, ease: "power2.out", immediateRender: false })
        .from(posterWrap, { opacity: 0, y: 40, scale: 0.96, duration: 0.8, ease: "power2.out", immediateRender: false }, "-=0.3")
        .from(descriptors, { opacity: 0, y: 20, duration: 0.45, stagger: 0.06, ease: "power2.out", immediateRender: false }, "-=0.5")
        .from(sep, { opacity: 0, scaleX: 0, duration: 0.5, ease: "power2.out", immediateRender: false }, "-=0.2")
        .from(scheduleHeading, { opacity: 0, y: 12, duration: 0.35, ease: "power2.out", immediateRender: false }, "-=0.3")
        .from(events, { opacity: 0, y: 20, scale: 0.97, duration: 0.5, stagger: 0.12, ease: "power2.out", immediateRender: false }, "-=0.2");

      if (posterGlow) {
        ScrollTrigger.create({
          trigger: section,
          start: "top 90%",
          end: "bottom 10%",
          invalidateOnRefresh: true,
          onEnter: () => gsap.to(posterGlow, { opacity: 1, duration: 1.2, ease: "power2.out" }),
          onLeave: () => gsap.to(posterGlow, { opacity: 0.3, duration: 0.8, ease: "power2.in" }),
          onEnterBack: () => gsap.to(posterGlow, { opacity: 1, duration: 1.2, ease: "power2.out" }),
          onLeaveBack: () => gsap.to(posterGlow, { opacity: 0.3, duration: 0.8, ease: "power2.in" }),
        });
      }
    });

    if (isTouch || reducedMotion) return;

    const rotateX = gsap.quickTo(poster, "rotateX", { duration: 0.4, ease: "power2.out" });
    const rotateY = gsap.quickTo(poster, "rotateY", { duration: 0.4, ease: "power2.out" });
    const glowX = posterGlow ? gsap.quickTo(posterGlow, "x", { duration: 0.6, ease: "power2.out" }) : null;
    const glowY = posterGlow ? gsap.quickTo(posterGlow, "y", { duration: 0.6, ease: "power2.out" }) : null;

    let trackingActive = false;

    function resetPoster() {
      rotateX(0);
      rotateY(0);
      if (glowX) glowX(0);
      if (glowY) glowY(0);
    }

    function onMouseMove(event) {
      if (!trackingActive) return;

      const rect = posterWrap.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const dx = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const dy = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      const maxAngle = 6;

      rotateY(clamp(-1, 1, dx) * maxAngle);
      rotateX(clamp(-1, 1, -dy) * maxAngle);
      if (glowX) glowX(clamp(-1, 1, dx) * 20);
      if (glowY) glowY(clamp(-1, 1, dy) * 15);
    }

    mainCtx.add(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top 95%",
        end: "bottom 5%",
        invalidateOnRefresh: true,
        onEnter: () => { trackingActive = true; },
        onLeave: () => { trackingActive = false; resetPoster(); },
        onEnterBack: () => { trackingActive = true; },
        onLeaveBack: () => { trackingActive = false; resetPoster(); },
      });

      const removeMove = addEvent(win, "mousemove", onMouseMove, { passive: true });
      return () => removeMove();
    });
  }

  /* ── Past performances — horizontal scroll ───────────────── */

  function initPastPerformances() {
    const section = $("#archive");
    const track = $("#past-track");
    const scrollWrap = $("#past-scroll-wrap");
    if (!section || !track || !scrollWrap) return;

    const cards = $$(".clt-home-past.card", section);
    const header = $(".clt-home-past.header", section);

    mainCtx.add(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top 85%",
        invalidateOnRefresh: true,
        onEnter() {
          gsap.from(header, { opacity: 0, y: 30, duration: 0.6, ease: "power2.out", immediateRender: false });
          gsap.from(cards, { opacity: 0, y: 30, scale: 0.95, duration: 0.6, stagger: 0.06, ease: "power2.out", delay: 0.2, immediateRender: false });
        },
        onLeaveBack() {
          gsap.set([header, ...cards].filter(Boolean), { clearProps: "opacity,transform" });
        },
      });

      const pastMedia = gsap.matchMedia();

      pastMedia.add("(min-width: 761px)", () => {
        const getScrollDistance = () => Math.max(track.scrollWidth - scrollWrap.clientWidth, 0);

        const tween = gsap.to(track, {
          x: () => -getScrollDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: scrollWrap,
            start: "center center",
            end: () => `+=${Math.max(getScrollDistance() * 1.08, win.innerHeight * 0.65)}`,
            scrub: 0.85,
            pin: scrollWrap,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefreshInit: () => gsap.set(track, { x: 0 }),
          },
        });

        return () => {
          tween.kill();
          gsap.set(track, { clearProps: "transform" });
        };
      });

      pastMedia.add("(max-width: 760px)", () => {
        gsap.set(track, { clearProps: "transform" });
      });

      return () => pastMedia.revert();
    });
  }

  /* ── Subscribe / Donate — flip-out panel ─────────────────── */

  function initSubscribeDonate() {
    const section = $("#support");
    const trigger = $("#donate-trigger");
    const panel = $("#donate-panel");
    const form = $("#subscribe-form");
    if (!section || !trigger || !panel) return;

    const header = $(".clt-home-subscribe.copy", section);
    const formEl = $(".clt-home-subscribe.form", section);
    const donateWrap = $(".clt-home-subscribe.donate-wrap", section);

    mainCtx.add(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        invalidateOnRefresh: true,
        onEnter() {
          gsap.timeline()
            .from(header, { opacity: 0, y: 30, duration: 0.6, ease: "power2.out", immediateRender: false })
            .from(formEl, { opacity: 0, y: 20, duration: 0.5, ease: "power2.out", immediateRender: false }, "-=0.3")
            .from(donateWrap, { opacity: 0, y: 20, duration: 0.5, ease: "power2.out", immediateRender: false }, "-=0.2");
        },
        onLeaveBack() {
          gsap.set([header, formEl, donateWrap].filter(Boolean), { clearProps: "opacity,transform" });
        },
      });
    });

    let isOpen = panel.classList.contains("clt-state-open");

    function setDonateOpen(nextOpen) {
      isOpen = nextOpen;
      trigger.setAttribute("aria-expanded", String(isOpen));

      if (isOpen) {
        panel.classList.add("clt-state-open");
        panel.setAttribute("aria-hidden", "false");

        gsap.killTweensOf(panel);
        gsap.fromTo(panel, {
          opacity: 0,
          maxHeight: 0,
          scaleY: 0.72,
          rotateX: 12,
        }, {
          opacity: 1,
          maxHeight: 420,
          scaleY: 1,
          rotateX: 0,
          duration: 0.58,
          ease: "power2.out",
          onUpdate: () => requestRefresh(40),
          onComplete: () => requestRefresh(20),
        });

        gsap.to(trigger, { scale: 0.96, opacity: 0.68, duration: 0.25, ease: "power2.out" });
      } else {
        gsap.killTweensOf(panel);
        gsap.to(panel, {
          opacity: 0,
          maxHeight: 0,
          scaleY: 0.72,
          rotateX: 12,
          duration: 0.35,
          ease: "power2.in",
          onUpdate: () => requestRefresh(40),
          onComplete() {
            panel.classList.remove("clt-state-open");
            panel.setAttribute("aria-hidden", "true");
            requestRefresh(20);
          },
        });

        gsap.to(trigger, { scale: 1, opacity: 1, duration: 0.25, ease: "power2.out" });
      }
    }

    mainCtx.add(() => {
      const removeClick = addEvent(trigger, "click", () => setDonateOpen(!isOpen));

      const amountCleanups = $$(".clt-home-subscribe.donate-amt", panel).map((button) => (
        addEvent(button, "click", () => {
          $$(".clt-home-subscribe.donate-amt", panel).forEach((item) => item.classList.remove("clt-state-active"));
          button.classList.add("clt-state-active");
        })
      ));

      return () => {
        removeClick();
        amountCleanups.forEach((cleanup) => cleanup());
      };
    });

    if (form) {
      mainCtx.add(() => {
        const removeSubmit = addEvent(form, "submit", (event) => {
          event.preventDefault();

          const input = $(".clt-home-subscribe.input", form);
          const button = $(".clt-home-subscribe.submit", form);
          const text = button ? $(".clt-button__text", button) : null;
          if (!input || !button || !text) return;

          const originalText = text.textContent;
          text.textContent = "Subscribed!";
          button.classList.add("loading");

          win.setTimeout(() => {
            button.classList.remove("loading");
            text.textContent = originalText;
            input.value = "";
          }, 1600);
        });

        return () => removeSubmit();
      });
    }
  }

  /* ── Footer — entrance + legal modals ────────────────────── */

  function initFooter() {
    const footer = $("#clt-home-footer");
    if (!footer) return;

    const brand = $(".clt-home-footer.brand", footer);
    const footerNav = $(".clt-home-footer.nav", footer);
    const social = $(".clt-home-footer.social", footer);
    const legal = $(".clt-home-footer.legal", footer);
    const socialLinks = $$(".clt-home-footer.social-link", footer);

    mainCtx.add(() => {
      ScrollTrigger.create({
        trigger: footer,
        start: "top 90%",
        invalidateOnRefresh: true,
        onEnter() {
          gsap.timeline()
            .from(brand, { opacity: 0, y: 20, duration: 0.5, ease: "power2.out", immediateRender: false })
            .from(footerNav, { opacity: 0, y: 20, duration: 0.4, ease: "power2.out", immediateRender: false }, "-=0.25")
            .from(social, { opacity: 0, y: 20, duration: 0.4, ease: "power2.out", immediateRender: false }, "-=0.2")
            .from(socialLinks, { opacity: 0, y: 10, duration: 0.3, stagger: 0.05, ease: "power2.out", immediateRender: false }, "-=0.16")
            .from(legal, { opacity: 0, y: 20, duration: 0.35, ease: "power2.out", immediateRender: false }, "-=0.15");
        },
        onLeaveBack() {
          gsap.set([brand, footerNav, social, legal, ...socialLinks].filter(Boolean), { clearProps: "opacity,transform" });
        },
      });
    });

    initLegalModals();
  }

  function initLegalModals() {
    const termsButton = $("#terms-btn");
    const privacyButton = $("#privacy-btn");
    const termsModal = $("#terms-modal");
    const privacyModal = $("#privacy-modal");
    let activeModal = null;

    function openModal(modal) {
      if (!modal) return;

      activeModal = modal;
      modal.classList.add("clt-state-open");
      modal.setAttribute("aria-hidden", "false");

      const panel = $(".clt-home-legal-modal.panel", modal);
      const backdrop = $(".clt-home-legal-modal.backdrop", modal);

      gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.32, ease: "power2.out" });
      gsap.fromTo(panel, {
        scale: 0.96,
        y: 18,
        opacity: 0,
      }, {
        scale: 1,
        y: 0,
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
        delay: 0.04,
      });

      if (lenis && typeof lenis.stop === "function") lenis.stop();
      doc.body.style.overflow = "hidden";

      if (panel) {
        panel.setAttribute("tabindex", "-1");
        panel.focus({ preventScroll: true });
      }
    }

    function closeModal(modal) {
      if (!modal) return;

      const panel = $(".clt-home-legal-modal.panel", modal);
      const backdrop = $(".clt-home-legal-modal.backdrop", modal);

      gsap.to(panel, { scale: 0.97, y: 14, opacity: 0, duration: 0.26, ease: "power2.in" });
      gsap.to(backdrop, {
        opacity: 0,
        duration: 0.28,
        delay: 0.06,
        onComplete() {
          modal.classList.remove("clt-state-open");
          modal.setAttribute("aria-hidden", "true");
          activeModal = null;

          if (lenis && typeof lenis.start === "function") lenis.start();
          doc.body.style.overflow = "";
        },
      });
    }

    mainCtx.add(() => {
      const cleanups = [];

      if (termsButton && termsModal) cleanups.push(addEvent(termsButton, "click", () => openModal(termsModal)));
      if (privacyButton && privacyModal) cleanups.push(addEvent(privacyButton, "click", () => openModal(privacyModal)));

      [termsModal, privacyModal].forEach((modal) => {
        if (!modal) return;

        $$("[data-close]", modal).forEach((element) => {
          cleanups.push(addEvent(element, "click", () => closeModal(modal)));
        });
      });

      cleanups.push(addEvent(win, "keydown", (event) => {
        if (event.key === "Escape" && activeModal) closeModal(activeModal);
      }));

      return () => cleanups.forEach((cleanup) => cleanup());
    });
  }

  /* ── Smooth anchor links ─────────────────────────────────── */

  function initSmoothAnchors() {
    mainCtx.add(() => {
      const cleanups = $$("[href^='#']").map((anchor) => (
        addEvent(anchor, "click", (event) => {
          const href = anchor.getAttribute("href");
          if (!href || href === "#") return;

          const target = doc.getElementById(href.slice(1));
          if (!target) return;

          event.preventDefault();

          const navShell = $(".clt-navbar-shell");
          const navOffset = navShell ? -Math.ceil(navShell.getBoundingClientRect().height + 18) : -80;

          if (lenis && typeof lenis.scrollTo === "function") {
            lenis.scrollTo(target, { offset: navOffset, duration: 1.25 });
          } else {
            const top = target.getBoundingClientRect().top + win.scrollY + navOffset;
            win.scrollTo({ top, behavior: reducedMotion ? "auto" : "smooth" });
          }
        })
      ));

      return () => cleanups.forEach((cleanup) => cleanup());
    });
  }

  /* ── Entry point ─────────────────────────────────────────── */

  function init() {
    gsap.defaults({ overwrite: "auto" });
    ScrollTrigger.config({ ignoreMobileResize: true });

    mainCtx = gsap.context(() => {}, doc.documentElement);

    initHeroCanvas();
    initLenis();

    if (reducedMotion) {
      showReducedHero();
    } else {
      initScrollScrub();
      initCurtain();
    }

    initDust();
    initSectionParallax();
    initMarquee();
    initExploreCarousel();
    initUpcomingEvents();
    initPastPerformances();
    initSubscribeDonate();
    initFooter();
    initSmoothAnchors();
    refreshWhenLayoutSettles();
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
