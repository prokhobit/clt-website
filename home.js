/* ============================================================
   Commonwealth Lyric Theater — home.js
   Scroll-scrubbed frame sequence, curtain, dust, carousel, etc.
   ============================================================ */

(() => {
  "use strict";

  const TITLE_REVEAL_AT = 0.841;

  const FRAME_URLS = [
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a35ad19668aae30c2f4_frame-0001.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a35c6cbe27116ca83fd_frame-0002.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a35e5fb917b3701b693_frame-0003.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a35ea0f0eaf9849bc7d_frame-0004.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a353f53f75c4a4afc37_frame-0005.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a352b32486feac6ca3a_frame-0006.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3557c7ebe55cced14f_frame-0007.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a36c6cbe27116ca8413_frame-0008.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3599f0f4e3bce84ed8_frame-0009.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3576258272cd4cb6bd_frame-0010.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a35fd70d5f782392667_frame-0011.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a36bef6cbe7de7ee6be_frame-0012.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a360cf1cb07be8f575f_frame-0013.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a36af60118b3da98894_frame-0014.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a368bf83b4f96c0edc6_frame-0015.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a362ce081e1c2288a56_frame-0016.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a38c340810734eaf1bf_frame-0017.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a36cc037ef6b6ca93af_frame-0018.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3674a49421d8e64a51_frame-0019.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a37aaa45cd1f9ad9d3d_frame-0020.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a37b698f545445f3072_frame-0021.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a36fbe31da754432dd0_frame-0022.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3730e7ab983ff88785_frame-0023.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3791172a8381ba554b_frame-0024.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3712ed158393908b5b_frame-0025.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a371f30f5e609c6d713_frame-0026.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a37a443bb054c91a82a_frame-0027.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a37c2aefe6f66c49b9b_frame-0028.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a38d1a7c9294893e5ad_frame-0029.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a376c15ae5cf118aa6e_frame-0030.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a37ce07cea9e0f2bac7_frame-0031.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3848d6eac10c55faf1_frame-0032.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a387aebda0073e143c0_frame-0033.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3870ed7d5cbe1eeed9_frame-0034.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a391e118e4eb775798b_frame-0035.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a38d1a7c9294893e5cd_frame-0036.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a38bbf57eb4cbe6c2dd_frame-0037.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a396931768c599e07af_frame-0038.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a38d1a7c9294893e5b9_frame-0039.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3828e0ee0d39a276d2_frame-0040.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a38910e69bbb92c6f18_frame-0041.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a38ce07cea9e0f2bae9_frame-0042.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3996e6be40cc4675a8_frame-0043.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3954c45d626d87cafa_frame-0044.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3956dc0a5be159afca_frame-0045.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a39ea0f0eaf9849bcd8_frame-0047.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a39340140c4a507f230_frame-0048.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a39d1a7c9294893e5e2_frame-0049.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a39f727e166199c61bf_frame-0050.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3a30f205fd825e03a9_frame-0051.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3ae7587cb7254ee555_frame-0052.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3a07eed619dbb4e4aa_frame-0053.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3b0bb5b86c7d7069ef_frame-0054.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3bfd70d5f7823926b9_frame-0055.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3bc2816e961d9bc668_frame-0056.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3a1ece60cdf119ba33_frame-0057.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3b9e24e5bce33a63c6_frame-0058.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3bcbe6d89d3daa8e43_frame-0059.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3be7587cb7254ee569_frame-0060.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3bbe06050c80133155_frame-0061.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3b3906db07ec1bd079_frame-0062.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3cb58dc8cd882f2091_frame-0063.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3cc2aefe6f66c49c25_frame-0064.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3c3e5bc3f756bfb835_frame-0065.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3c1bc4b4982343ffdb_frame-0066.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3ca38bfb58b2618bbc_frame-0067.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3c3a6b8e8e1cea69e9_frame-0068.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3c72a900ff71000f61_frame-0069.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3cb9ce81d003e85c5a_frame-0070.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3c54c45d626d87cb63_frame-0071.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3dce07cea9e0f2bb35_frame-0072.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3dbef6cbe7de7ee728_frame-0073.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3d0f84346383459460_frame-0074.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3dcb137bad351d487d_frame-0075.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3d742c9dd58f1df76c_frame-0076.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3dcc037ef6b6ca9448_frame-0077.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3df15f0eb7499d378e_frame-0078.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3d4b92169c2c0ba4be_frame-0079.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3d1b20876355f37c47_frame-0080.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3d3906db07ec1bd08e_frame-0081.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3ec6e6531097d64768_frame-0082.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3e63bfbec4c46c714b_frame-0083.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3e2d31e03478434f1e_frame-0084.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3ea023cdced8eb993b_frame-0085.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3e91172a8381ba55cc_frame-0086.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3ea29e11ad6e988c81_frame-0087.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3fe61bcab7a436e274_frame-0088.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3f660858e96979de86_frame-0089.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3fbeddd5210b82822a_frame-0090.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3f43a6cb4ab827ff62_frame-0091.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3fc2816e961d9bc733_frame-0092.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a3fe9f1e0b11f7ce49c_frame-0093.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a40275a8625e03cd6bd_frame-0094.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a40b93bb0732bfef0f0_frame-0095.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a403fa1e48ae3cc8e9d_frame-0096.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a403ece741832a8219d_frame-0097.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a40799dcbece37c4110_frame-0098.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a40efb8cf1031cd4afc_frame-0099.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a401ece60cdf119badd_frame-0100.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a405bb8e98d36d644ad_frame-0101.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a40eb145601d076419a_frame-0102.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a41567b702dcc3d18c5_frame-0103.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a415c8f8a44d977465b_frame-0104.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4101b6f40d2d832ce2_frame-0105.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a412716fe8617142b0c_frame-0106.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a419e24e5bce33a6417_frame-0108.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a410b10dc7360c90f97_frame-0109.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a414f739c84981cf04e_frame-0110.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a426ce43654e71c9fe3_frame-0111.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a42aaa45cd1f9ad9d8b_frame-0112.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a423a6b8e8e1cea6a77_frame-0113.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4239fdaf7c92706366_frame-0114.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4256c809384381bc44_frame-0115.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a42d1d4e5bc375da69b_frame-0116.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a423ab3744c2a5c486e_frame-0117.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a42f15f0eb7499d37d9_frame-0118.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a43097e3e4f6ec78770_frame-0119.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4311f0be990734fe7d_frame-0120.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a434f739c84981cf062_frame-0121.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a438e705fb40c09299a_frame-0122.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a43841c442b7016d945_frame-0123.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a43364b0a4d8f785569_frame-0124.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a44d26c1f6fe0bc00c7_frame-0125.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a442afaaee3a2663941_frame-0126.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a44751b23bd914ded02_frame-0127.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a44354572db1da09f19_frame-0128.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a444cfa5c5e15ebbb08_frame-0129.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4476258272cd4cb7cc_frame-0130.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a44099f73df0a6a1297_frame-0131.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a448560082423df8d4e_frame-0132.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a449f6c144ad82daa4f_frame-0133.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a45b6f436467f3736c9_frame-0134.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a45beddd5210b82827e_frame-0135.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a45f8c75d10e4359658_frame-0136.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a45249b5c83297f9444_frame-0137.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4592546979db11319d_frame-0138.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a45f2d8d4ac76520426_frame-0139.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4688f202d72a9fea0a_frame-0140.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a468e705fb40c0929c8_frame-0141.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a455db0694214a74552_frame-0142.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a46567b702dcc3d19db_frame-0143.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a46e5b9a26605a9332d_frame-0144.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a46be06050c801332a6_frame-0145.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a46cc335f46dab0df83_frame-0146.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4bb6f436467f3738ae_frame-0147.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a47d26c1f6fe0bc0271_frame-0148.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a46d26c1f6fe0bc0256_frame-0149.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a46eb99db6c549dfb21_frame-0150.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a471e118e4eb7757a62_frame-0151.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a49066d8e822f42d252_frame-0152.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4bedb4722c99c8e975_frame-0153.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4a8f89be046ed0446e_frame-0154.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4991172a8381ba5628_frame-0155.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4a6ef070f7aa731534_frame-0156.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4a9e7ac4761ba9767c_frame-0157.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a47fd70d5f7823926ff_frame-0158.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4a1bc4b49823440090_frame-0159.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4a0ec24e311b11db66_frame-0160.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4a61d2a6be196c5a23_frame-0161.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4bc7c37d65ad906ddf_frame-0162.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4b8acd6bf9b7adb804_frame-0163.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4aeb145601d0764222_frame-0164.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4bfc1775799f12ab0d_frame-0165.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4a0e9889939b999acf_frame-0166.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4bed275c6736f03f0c_frame-0167.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4bf4e0e9b9731a75df_frame-0168.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4c30e7ab983ff88c52_frame-0169.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4c20785b9922af78d2_frame-0171.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4ccfebf91f245697cd_frame-0172.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4c1e87e0cf21b3e4e0_frame-0173.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4c604992735e1f1b0b_frame-0174.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4c4cb1e12be394d4f2_frame-0175.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4cdc1e72c50e3a0b50_frame-0176.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4dfe52ab7f12cf51da_frame-0177.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4d1ece60cdf119bb26_frame-0178.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4d0d8e45c8af33651a_frame-0179.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4d74a49421d8e64c3a_frame-0180.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4e679f5b8f26d68ad2_frame-0181.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4e8560082423df8e23_frame-0182.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4ece07cea9e0f2bc2f_frame-0183.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4f8bc2eb5ae2f2c9b8_frame-0184.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4fcdeeffc95f29c717_frame-0185.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4e20785b9922af7913_frame-0186.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4ecfebf91f245699bb_frame-0187.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4ef3ad3ca4178970a9_frame-0188.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4ef727a538f3c5d9c4_frame-0189.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4f4edbae5dd4552f1c_frame-0190.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4fa29e11ad6e988dc1_frame-0193.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4f275a8625e03cd768_frame-0194.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4fe01d7dadb6eeffd3_frame-0195.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4fefb8cf1031cd4bd8_frame-0196.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4fb5748c2ba0caec76_frame-0197.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a50995f71e13063b0dd_frame-0198.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a50354572db1da09fab_frame-0199.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a50099f73df0a6a13e5_frame-0200.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a50751b23bd914ded9f_frame-0201.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a50567b702dcc3d1a58_frame-0202.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a509427ff4537867863_frame-0203.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a511ece60cdf119bb86_frame-0204.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a51fe52ab7f12cf51fa_frame-0205.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a51dc1e72c50e3a0ca2_frame-0206.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a5128e0ee0d39a278ef_frame-0207.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a51c6e6531097d64a89_frame-0208.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a5149461c37f719138a_frame-0209.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a5120785b9922af7960_frame-0210.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a5233023d85dc4e741a_frame-0211.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4688ffe7ca32af0fd6_frame-0212.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a473f53f75c4a4afd84_frame-0213.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a47c7c37d65ad906dad_frame-0214.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a470e9889939b999a90_frame-0215.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a47f72a9a028dcc066e_frame-0216.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a48f4eec82dd5e0fbb0_frame-0217.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a48dc1e72c50e3a0b1c_frame-0218.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a484314e618440c4ea6_frame-0219.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a483fa1e48ae3cc8ef1_frame-0220.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a481945969ab35e4870_frame-0221.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a48a7df565953258c13_frame-0222.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4807eed619dbb4e63e_frame-0223.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a48f72a9a028dcc0684_frame-0224.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a48c0d305bf40ce7331_frame-0225.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a484314e618440c4ecd_frame-0226.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a498560082423df8d92_frame-0227.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a491945969ab35e488b_frame-0228.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a52f4e0e9b9731a7607_frame-0229.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a52424ba9e393c7d238_frame-0230.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a52a38bfb58b2618ca5_frame-0231.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a521ece60cdf119bbb5_frame-0232.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a523f53f75c4a4aff7c_frame-0234.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a536ef070f7aa73158f_frame-0235.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a533ab3744c2a5c48e8_frame-0236.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a539ef94c938cf07c5d_frame-0237.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a53046ae8dbd4712dd3_frame-0238.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a53d31334c4f81020d6_frame-0239.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a5310ab427d2ebf3e02_frame-0240.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a5396e6be40cc4676ed_frame-0241.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a538fe44dc6b4f58026_frame-0242.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a5307eed619dbb4e6ca_frame-0243.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a530b10dc7360c910d4_frame-0244.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a5402b663b89be2543f_frame-0245.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a541f30f5e609c6d8b1_frame-0246.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a54e1517a752ec189bc_frame-0247.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a540030b57ecf440576_frame-0248.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a54f29cfaca54deb5e2_frame-0249.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a54f4eec82dd5e0fca3_frame-0250.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a490f84346383459580_frame-0251.png",
    "https://cdn.prod.website-files.com/69daeaa84d0242f517ee1a64/69fd4a4b7666c90470b4e1f4_frame-0252.png",
  ];

  const FRAME_COUNT = FRAME_URLS.length;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(pointer: coarse)").matches;

  gsap.registerPlugin(ScrollTrigger, Draggable);

  let lenis = null;
  let mainCtx = null;

  /* ── Lenis smooth scroll ─────────────────────────────────── */

  function initLenis() {
    lenis = new Lenis({
      lerp: 0.07,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.6,
      infinite: false,
    });

    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (arguments.length) lenis.scrollTo(value, { immediate: true });
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      },
    });

    lenis.on("scroll", ScrollTrigger.update);
    ScrollTrigger.refresh();
  }

  /* ── Canvas frame player ─────────────────────────────────── */

  let frames = [];
  let currentFrameIdx = 0;
  let canvas, ctx;

  function frameSrc(i) {
    return FRAME_URLS[i] || FRAME_URLS[0];
  }

  function drawFrame(index) {
    if (!ctx || !frames[index] || !frames[index].complete || frames[index].naturalWidth === 0) return;
    currentFrameIdx = index;
    const img = frames[index];
    const cw = canvas.width;
    const ch = canvas.height;
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
  }

  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    drawFrame(currentFrameIdx);
  }

  function preloadFrames() {
    return new Promise((resolve) => {
      const images = new Array(FRAME_COUNT);
      let settled = 0;
      for (let i = 0; i < FRAME_COUNT; i++) {
        const img = new Image();
        img.onload = img.onerror = () => {
          if (++settled === FRAME_COUNT) resolve(images);
        };
        images[i] = img;
        img.src = frameSrc(i);
      }
    });
  }

  /* ── Scroll scrub — drives canvas frame index ────────────── */

  function initScrollScrub(ctx) {
    let titleRevealed = false;

    ctx.add(() => {
      ScrollTrigger.create({
        trigger: '[data-gsap="home-hero-pin"]',
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate(self) {
          const idx = Math.round(self.progress * (FRAME_COUNT - 1));
          drawFrame(idx);

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
    const eyebrow = document.querySelector('[data-gsap="home-hero-eyebrow"]');
    const lines = gsap.utils.toArray('[data-gsap="home-hero-line"]');
    const cta = document.querySelector('[data-gsap="home-hero-cta"]');
    const reveal = document.querySelector('[data-gsap="home-hero-reveal"]');

    const tl = gsap.timeline({
      onComplete() {
        if (reveal) reveal.style.pointerEvents = "auto";
        if (cta) cta.style.pointerEvents = "auto";
      },
    });

    tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" })
      .to(lines, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" }, "-=0.25")
      .to(cta, { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" }, "-=0.2");
  }

  /* ── Curtain — fold injection + scroll open ──────────────── */

  function initCurtain(ctx) {
    const left = document.getElementById("clt-home-curtain-left");
    const right = document.getElementById("clt-home-curtain-right");
    const stage = document.querySelector('[data-gsap="home-curtain-stage"]');
    if (!left || !right || !stage) return;

    const foldConfig = [
      { el: left, folds: [
        { cls: "deep",    left: "6%",  anim: "curtain-fold-a", dur: "6.8s", delay: "0.0s" },
        { cls: "shallow", left: "14%", anim: "curtain-fold-b", dur: "7.5s", delay: "0.8s" },
        { cls: "deep",    left: "23%", anim: "curtain-fold-c", dur: "6.2s", delay: "1.6s" },
        { cls: "shallow", left: "32%", anim: "curtain-fold-d", dur: "7.0s", delay: "0.4s" },
        { cls: "deep",    left: "43%", anim: "curtain-fold-e", dur: "6.5s", delay: "1.2s" },
        { cls: "shallow", left: "53%", anim: "curtain-fold-b", dur: "7.2s", delay: "0.6s" },
        { cls: "deep",    left: "63%", anim: "curtain-fold-a", dur: "6.4s", delay: "1.8s" },
        { cls: "shallow", left: "72%", anim: "curtain-fold-d", dur: "7.4s", delay: "1.0s" },
        { cls: "deep",    left: "82%", anim: "curtain-fold-c", dur: "6.6s", delay: "0.2s" },
        { cls: "shallow", left: "91%", anim: "curtain-fold-e", dur: "7.1s", delay: "1.4s" },
      ]},
      { el: right, folds: [
        { cls: "shallow", left: "5%",  anim: "curtain-fold-c", dur: "7.0s", delay: "0.5s" },
        { cls: "deep",    left: "14%", anim: "curtain-fold-e", dur: "6.3s", delay: "1.3s" },
        { cls: "shallow", left: "22%", anim: "curtain-fold-a", dur: "7.6s", delay: "0.9s" },
        { cls: "deep",    left: "32%", anim: "curtain-fold-d", dur: "6.1s", delay: "0.1s" },
        { cls: "shallow", left: "42%", anim: "curtain-fold-b", dur: "7.3s", delay: "1.7s" },
        { cls: "deep",    left: "52%", anim: "curtain-fold-c", dur: "6.7s", delay: "0.7s" },
        { cls: "shallow", left: "62%", anim: "curtain-fold-e", dur: "7.5s", delay: "1.5s" },
        { cls: "deep",    left: "73%", anim: "curtain-fold-a", dur: "6.0s", delay: "0.3s" },
        { cls: "shallow", left: "83%", anim: "curtain-fold-d", dur: "7.2s", delay: "1.1s" },
        { cls: "deep",    left: "92%", anim: "curtain-fold-b", dur: "6.9s", delay: "0.6s" },
      ]},
    ];

    foldConfig.forEach(({ el, folds }) => {
      folds.forEach(({ cls, left: l, anim, dur, delay }) => {
        const f = document.createElement("div");
        f.className = `clt-home-curtain fold ${cls}`;
        f.style.left = l;
        f.style.animation = `${anim} ${dur} ${delay} ease-in-out infinite alternate`;
        el.insertBefore(f, el.querySelector('[data-gsap="home-curtain-panel-top"]'));
      });
    });

    const prompt = document.querySelector('[data-gsap="home-curtain-prompt"]');

    ctx.add(() => {
      ScrollTrigger.create({
        trigger: '[data-gsap="home-hero-pin"]',
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate(self) {
          const openEnd = 0.12;
          const rawProgress = Math.min(self.progress / openEnd, 1);
          const eased = 1 - Math.pow(1 - rawProgress, 2.8);
          const tx = eased * 110;
          const gather = 1 - eased * 0.28;
          const sway = Math.sin(rawProgress * Math.PI) * 3.5;

          left.style.transform = `translateX(-${tx}%) scaleX(${gather}) skewY(${sway}deg)`;
          right.style.transform = `translateX(${tx}%) scaleX(${gather}) skewY(-${sway}deg)`;

          if (prompt && self.progress > 0.003) {
            prompt.style.opacity = Math.max(0, 1 - rawProgress * 5).toString();
          }

          stage.style.visibility = rawProgress >= 1 ? "hidden" : "visible";
        },
      });
    });
  }

  /* ── Ambient dust particles ──────────────────────────────── */

  function initDust(ctx) {
    const far = document.getElementById("dust-far");
    const mid = document.getElementById("dust-mid");
    const near = document.getElementById("dust-near");
    if (!far && !mid && !near) return;

    const fraction = reducedMotion ? 0.4 : 1;
    const tones = ["warm", "warm", "warm", "brass", "brass", "cool"];
    const allStars = [];

    function spawn(container, count, minSize, maxSize, speed) {
      if (!container) return;
      const frag = document.createDocumentFragment();
      for (let i = 0; i < Math.round(count * fraction); i++) {
        const el = document.createElement("div");
        const tone = tones[Math.floor(Math.random() * tones.length)];
        el.className = `clt-home-dust particle ${tone}`;
        const size = minSize + Math.random() * (maxSize - minSize);
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        el.style.width = size + "px";
        el.style.height = size + "px";
        el.style.left = x + "%";
        el.style.top = y + "%";
        el.style.setProperty("--twinkle-dur", (2.5 + Math.random() * 4.5) + "s");
        el.style.setProperty("--twinkle-delay", (Math.random() * 5) + "s");
        el.style.setProperty("--twinkle-lo", (0.18 + Math.random() * 0.18).toFixed(2));
        el.style.setProperty("--twinkle-hi", (0.72 + Math.random() * 0.28).toFixed(2));
        frag.appendChild(el);
        allStars.push({ el, initialY: y, speed });
      }
      container.appendChild(frag);
    }

    spawn(far, 46, 1.1, 2.0, 0.08);
    spawn(mid, 30, 1.4, 2.8, 0.20 + Math.random() * 0.24);
    spawn(near, 18, 1.8, 3.4, 0.34 + Math.random() * 0.24);

    if (reducedMotion) return;

    ctx.add(() => {
      allStars.forEach(({ el, speed }) => {
        if (speed === 0) return;
        gsap.to(el, {
          x: gsap.utils.random(-20, 20),
          y: gsap.utils.random(-25, 25),
          duration: gsap.utils.random(20, 38),
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      });

      gsap.to(far, {
        y: 80,
        ease: "none",
        scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: true },
      });
      gsap.to(mid, {
        y: -140,
        ease: "none",
        scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: true },
      });
      gsap.to(near, {
        y: -280,
        ease: "none",
        scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: true },
      });
    });

    if (lenis) {
      lenis.on("scroll", ({ scroll, velocity }) => {
        const stretch = Math.max(1, Math.min(1 + Math.abs(velocity) * 0.025, 1.35));
        allStars.forEach((star) => {
          if (star.speed === 0) return;
          let pos = (star.initialY - scroll * star.speed * 0.04) % 100;
          if (pos < 0) pos += 100;
          star.el.style.top = pos + "%";
          star.el.style.transform = `scaleY(${stretch.toFixed(2)})`;
        });
      });
    }
  }

  /* ── Section parallax ────────────────────────────────────── */

  function initSectionParallax(ctx) {
    const sections = gsap.utils.toArray('[data-gsap~="home-section"]');

    ctx.add(() => {
      sections.forEach((section) => {
        const kicker = section.querySelector(".clt-eyebrow");
        const title = section.querySelector("h2");
        const subtitle = section.querySelector(".clt-home-past.subtitle, .clt-home-subscribe.desc");

        if (kicker) {
          gsap.fromTo(kicker, { y: 30, opacity: 0 }, {
            y: 0, opacity: 1,
            immediateRender: false,
            scrollTrigger: { trigger: section, start: "top 88%", end: "top 55%", scrub: 0.8 },
          });
        }
        if (title) {
          gsap.fromTo(title, { y: 50, opacity: 0, scale: 0.97 }, {
            y: 0, opacity: 1, scale: 1,
            immediateRender: false,
            scrollTrigger: { trigger: section, start: "top 85%", end: "top 50%", scrub: 0.8 },
          });
        }
        if (subtitle) {
          gsap.fromTo(subtitle, { y: 25, opacity: 0 }, {
            y: 0, opacity: 1,
            immediateRender: false,
            scrollTrigger: { trigger: section, start: "top 80%", end: "top 48%", scrub: 0.8 },
          });
        }
      });

      gsap.utils.toArray('[data-gsap~="home-bloom"]').forEach((bloom, i) => {
        gsap.to(bloom, {
          y: (i % 2 === 0 ? 1 : -1) * 80,
          ease: "none",
          scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: true },
        });
      });
    });
  }

  /* ── Marquee — scroll-direction aware ────────────────────── */

  function initMarquee(ctx) {
    const track = document.querySelector(".clt-home-marquee.track");
    const section = document.querySelector(".clt-home-marquee");
    if (!track || !section) return;

    track.style.animation = "none";

    const firstSet = track.querySelector(".clt-home-marquee.set");
    if (!firstSet) return;
    const setWidth = firstSet.offsetWidth + parseFloat(getComputedStyle(firstSet).paddingRight || 0);

    ctx.add(() => {
      const marqueeTween = gsap.to(track, {
        x: -setWidth,
        duration: 40,
        ease: "none",
        repeat: -1,
      });

      section.addEventListener("mouseenter", () => {
        gsap.to(marqueeTween, { timeScale: 0.3, duration: 0.6, overwrite: true });
      });
      section.addEventListener("mouseleave", () => {
        gsap.to(marqueeTween, { timeScale: 1, duration: 0.6, overwrite: true });
      });

      ScrollTrigger.create({
        onUpdate(self) {
          const dir = self.direction;
          const vel = Math.min(Math.abs(self.getVelocity()) / 2500, 4);
          gsap.to(marqueeTween, {
            timeScale: dir * Math.max(1, vel),
            duration: 0.5,
            overwrite: true,
          });
        },
      });
    });
  }

  /* ── Explore — infinite draggable carousel ───────────────── */

  function initExploreCarousel(ctx) {
    const track = document.getElementById("explore-track");
    const trackMask = document.getElementById("explore-mask");
    const section = document.querySelector(".clt-home-explore");
    if (!track || !trackMask || !section) return;

    const originalCards = [...track.querySelectorAll(".clt-home-explore.card")];
    const numCards = originalCards.length;

    originalCards.forEach((card) => {
      const clone = card.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
    });

    function calcSetWidth() {
      const cardW = track.querySelector(".clt-home-explore.card").offsetWidth;
      const g = parseFloat(getComputedStyle(track).gap) || 24;
      return numCards * (cardW + g);
    }

    let setWidth = calcSetWidth();
    const onResize = () => { setWidth = calcSetWidth(); };
    window.addEventListener("resize", onResize);

    ctx.add(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top 95%",
        end: "top 20%",
        onEnter: () => gsap.to(section, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }),
        onLeaveBack: () => gsap.to(section, { opacity: 0, y: 50, duration: 0.5, ease: "power2.in" }),
      });

      return () => window.removeEventListener("resize", onResize);
    });

    let lastDragX = 0;
    let lastDragTime = 0;
    let dragVelocity = 0;
    let momentumTween = null;

    function wrapX(x) {
      let w = x;
      while (w < -setWidth) w += setWidth;
      while (w > 0) w -= setWidth;
      return w;
    }

    const draggable = Draggable.create(track, {
      type: "x",
      cursor: "none",
      edgeResistance: 0,
      dragClickables: true,
      onPress() {
        if (momentumTween) momentumTween.kill();
        lastDragX = this.x;
        lastDragTime = Date.now();
        gsap.to(trackMask, { rotation: -2.6, duration: 0.3, ease: "power2.out" });
      },
      onDrag() {
        const now = Date.now();
        const dt = (now - lastDragTime) / 1000;
        if (dt > 0.016) {
          dragVelocity = (this.x - lastDragX) / dt;
          lastDragX = this.x;
          lastDragTime = now;
        }
        const wrapped = wrapX(this.x);
        if (wrapped !== this.x) {
          gsap.set(track, { x: wrapped });
          this.update();
        }
      },
      onRelease() {
        gsap.to(trackMask, { rotation: -2, duration: 0.6, ease: "elastic.out(1, 0.5)" });
      },
      onDragEnd() {
        const dist = dragVelocity * 0.45;
        const startX = gsap.getProperty(track, "x");
        const proxy = { p: 0 };
        const dur = Math.min(Math.max(Math.abs(dragVelocity) / 600, 0.4), 2.5);

        momentumTween = gsap.to(proxy, {
          p: 1,
          duration: dur,
          ease: "power3.out",
          onUpdate() {
            gsap.set(track, { x: wrapX(startX + dist * proxy.p) });
          },
          onComplete() {
            draggable.update();
          },
        });
      },
    })[0];

    initCarouselLens(trackMask, track);

    let lastScrollY = lenis ? lenis.scroll : window.scrollY;
    gsap.ticker.add(() => {
      const currentScrollY = lenis ? lenis.scroll : window.scrollY;
      const delta = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      if (Draggable.get(track)?.isDragging) return;
      if (momentumTween && momentumTween.isActive()) return;
      if (Math.abs(delta) < 0.5) return;

      const currentX = gsap.getProperty(track, "x");
      gsap.set(track, { x: wrapX(currentX - delta * 1.5) });
      draggable.update();
    });
  }

  /* ── Carousel lens — custom cursor ───────────────────────── */

  function initCarouselLens(trackMask, track) {
    const lens = document.getElementById("clt-home-carousel-lens");
    if (!lens || isTouch) return;

    const moveX = gsap.quickTo(lens, "left", { duration: 0.12, ease: "power2.out" });
    const moveY = gsap.quickTo(lens, "top", { duration: 0.12, ease: "power2.out" });

    let isOverTrack = false;
    let isOverCard = false;
    let isDragging = false;

    function update() {
      lens.classList.remove("clt-state-visible", "clt-home-is-hidden", "clt-state-dragging");

      if (!isOverTrack) return;

      if (isDragging) {
        lens.classList.add("clt-state-visible", "clt-state-dragging");
        return;
      }
      lens.classList.add("clt-state-visible");
    }

    trackMask.addEventListener("mouseenter", () => { isOverTrack = true; update(); });
    trackMask.addEventListener("mouseleave", () => { isOverTrack = false; isDragging = false; update(); });
    trackMask.addEventListener("mousemove", (e) => { moveX(e.clientX); moveY(e.clientY); });

    track.querySelectorAll(".clt-home-explore.card").forEach((card) => {
      card.addEventListener("mouseenter", () => { isOverCard = true; update(); });
      card.addEventListener("mouseleave", () => { isOverCard = false; update(); });
    });

    trackMask.addEventListener("mousedown", () => { isDragging = true; update(); });
    window.addEventListener("mouseup", () => { if (isDragging) { isDragging = false; update(); } });
  }

  /* ── Upcoming events — entrance + mouse-tracking parallax ── */

  function initUpcomingEvents(ctx) {
    const section = document.getElementById("season");
    const posterWrap = document.getElementById("upcoming-poster-wrap");
    const poster = document.getElementById("upcoming-poster");
    if (!section || !posterWrap || !poster) return;

    const header = section.querySelector(".clt-home-upcoming.header");
    const posterGlow = section.querySelector(".clt-home-upcoming.poster-glow");
    const details = section.querySelector(".clt-home-upcoming.details");
    const descriptors = gsap.utils.toArray(section.querySelectorAll(".clt-home-upcoming.descriptor"));
    const events = gsap.utils.toArray(section.querySelectorAll(".clt-home-upcoming.event"));
    const sep = section.querySelector(".clt-home-upcoming.sep");
    const scheduleHeading = section.querySelector(".clt-home-upcoming.schedule-heading");

    ctx.add(() => {
      const entranceTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 82%",
          end: "top 20%",
          toggleActions: "play none none reverse",
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
          onEnter: () => gsap.to(posterGlow, { opacity: 1, duration: 1.2, ease: "power2.out" }),
          onLeave: () => gsap.to(posterGlow, { opacity: 0.3, duration: 0.8, ease: "power2.in" }),
          onEnterBack: () => gsap.to(posterGlow, { opacity: 1, duration: 1.2, ease: "power2.out" }),
          onLeaveBack: () => gsap.to(posterGlow, { opacity: 0.3, duration: 0.8, ease: "power2.in" }),
        });
      }
    });

    if (isTouch) return;

    const rotX = gsap.quickTo(poster, "rotateX", { duration: 0.4, ease: "power2.out" });
    const rotY = gsap.quickTo(poster, "rotateY", { duration: 0.4, ease: "power2.out" });
    const glowX = posterGlow ? gsap.quickTo(posterGlow, "x", { duration: 0.6, ease: "power2.out" }) : null;
    const glowY = posterGlow ? gsap.quickTo(posterGlow, "y", { duration: 0.6, ease: "power2.out" }) : null;

    let trackingActive = false;

    ctx.add(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top 95%",
        end: "bottom 5%",
        onEnter: () => { trackingActive = true; },
        onLeave: () => { trackingActive = false; resetPoster(); },
        onEnterBack: () => { trackingActive = true; },
        onLeaveBack: () => { trackingActive = false; resetPoster(); },
      });
    });

    function resetPoster() {
      rotX(0);
      rotY(0);
      if (glowX) glowX(0);
      if (glowY) glowY(0);
    }

    function onMouseMove(e) {
      if (!trackingActive) return;
      const rect = posterWrap.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const maxAngle = 6;
      rotY(dx * maxAngle);
      rotX(-dy * maxAngle);
      if (glowX) glowX(dx * 20);
      if (glowY) glowY(dy * 15);
    }

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    ctx.add(() => () => window.removeEventListener("mousemove", onMouseMove));
  }

  /* ── Past performances — horizontal scroll ───────────────── */

  function initPastPerformances(ctx) {
    const section = document.getElementById("archive");
    const track = document.getElementById("past-track");
    const scrollWrap = document.getElementById("past-scroll-wrap");
    if (!section || !track || !scrollWrap) return;

    const cards = gsap.utils.toArray(".clt-home-past.card");
    const header = section.querySelector(".clt-home-past.header");

    ctx.add(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top 85%",
        onEnter() {
          gsap.from(header, { opacity: 0, y: 30, duration: 0.6, ease: "power2.out" });
          gsap.from(cards, { opacity: 0, y: 30, scale: 0.95, duration: 0.6, stagger: 0.06, ease: "power2.out", delay: 0.2 });
        },
        onLeaveBack() {
          gsap.set([header, ...cards], { clearProps: "opacity,transform" });
        },
      });

      const pastMedia = gsap.matchMedia();

      pastMedia.add("(min-width: 761px)", () => {
        const getScrollDist = () => Math.max(track.scrollWidth - scrollWrap.clientWidth, 0);

        const tween = gsap.to(track, {
          x: () => -getScrollDist(),
          ease: "none",
          scrollTrigger: {
            trigger: scrollWrap,
            start: "center center",
            end: () => `+=${Math.max(getScrollDist() * 1.08, window.innerHeight * 0.65)}`,
            scrub: 0.85,
            pin: scrollWrap,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefreshInit() {
              gsap.set(track, { x: 0 });
            },
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

      return () => {
        pastMedia.revert();
      };
    });
  }

  /* ── Subscribe / Donate — flip-out panel ─────────────────── */

  function initSubscribeDonate(ctx) {
    const section = document.getElementById("support");
    const trigger = document.getElementById("donate-trigger");
    const panel = document.getElementById("donate-panel");
    const form = document.getElementById("subscribe-form");
    if (!section || !trigger || !panel) return;

    const header = section.querySelector(".clt-home-subscribe.copy");
    const formEl = section.querySelector(".clt-home-subscribe.form");
    const donateWrap = section.querySelector(".clt-home-subscribe.donate-wrap");

    ctx.add(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        onEnter() {
          gsap.timeline()
            .from(header, { opacity: 0, y: 30, duration: 0.6, ease: "power2.out", immediateRender: false })
            .from(formEl, { opacity: 0, y: 20, duration: 0.5, ease: "power2.out", immediateRender: false }, "-=0.3")
            .from(donateWrap, { opacity: 0, y: 20, duration: 0.5, ease: "power2.out", immediateRender: false }, "-=0.2");
        },
        onLeaveBack() {
          gsap.set([header, formEl, donateWrap], { clearProps: "opacity,transform" });
        },
      });
    });

    let isOpen = false;

    trigger.addEventListener("click", () => {
      isOpen = !isOpen;

      if (isOpen) {
        panel.classList.add("clt-state-open");
        panel.setAttribute("aria-hidden", "false");
        gsap.fromTo(panel, { opacity: 0, maxHeight: 0, scaleY: 0.7, rotateX: 15 }, {
          opacity: 1, maxHeight: 400, scaleY: 1, rotateX: 0, duration: 0.6, ease: "power2.out",
        });
        gsap.to(trigger, { scale: 0.95, opacity: 0.6, duration: 0.3, ease: "power2.out" });
      } else {
        gsap.to(panel, {
          opacity: 0, maxHeight: 0, scaleY: 0.7, rotateX: 15, duration: 0.4, ease: "power2.in",
          onComplete() {
            panel.classList.remove("clt-state-open");
            panel.setAttribute("aria-hidden", "true");
          },
        });
        gsap.to(trigger, { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" });
      }
    });

    panel.querySelectorAll(".donate-amt").forEach((btn) => {
      btn.addEventListener("click", () => {
        panel.querySelectorAll(".donate-amt").forEach((b) => b.classList.remove("clt-state-active"));
        btn.classList.add("clt-state-active");
      });
    });

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = form.querySelector(".input");
        const btn = form.querySelector(".submit");
        if (!input || !btn) return;
        const textEl = btn.querySelector(".clt-button__text");
        if (!textEl) return;
        const originalText = textEl.textContent;
        textEl.textContent = "Subscribed!";
        btn.classList.add("loading");
        setTimeout(() => {
          btn.classList.remove("loading");
          textEl.textContent = originalText;
          input.value = "";
        }, 2000);
      });
    }
  }

  /* ── Footer — entrance + legal modals ────────────────────── */

  function initFooter(ctx) {
    const footer = document.getElementById("clt-home-footer");
    if (!footer) return;

    const brand = footer.querySelector(".clt-home-footer.brand");
    const footerNav = footer.querySelector(".clt-home-footer.nav");
    const social = footer.querySelector(".clt-home-footer.social");
    const legal = footer.querySelector(".clt-home-footer.legal");
    const socialLinks = gsap.utils.toArray(footer.querySelectorAll(".clt-home-footer.social-link"));

    ctx.add(() => {
      ScrollTrigger.create({
        trigger: footer,
        start: "top 90%",
        onEnter() {
          gsap.timeline()
            .from(brand, { opacity: 0, y: 20, duration: 0.5, ease: "power2.out", immediateRender: false })
            .from(footerNav, { opacity: 0, y: 20, duration: 0.4, ease: "power2.out", immediateRender: false }, "-=0.25")
            .from(social, { opacity: 0, y: 20, duration: 0.4, ease: "power2.out", immediateRender: false }, "-=0.2")
            .from(socialLinks, { opacity: 0, y: 10, duration: 0.3, stagger: 0.05, ease: "power2.out", immediateRender: false }, "-=0.16")
            .from(legal, { opacity: 0, y: 20, duration: 0.35, ease: "power2.out", immediateRender: false }, "-=0.15");
        },
        onLeaveBack() {
          gsap.set([brand, footerNav, social, legal, ...socialLinks], { clearProps: "opacity,transform" });
        },
      });
    });

    initLegalModals();
  }

  function initLegalModals() {
    const termsBtn = document.getElementById("terms-btn");
    const privacyBtn = document.getElementById("privacy-btn");
    const termsModal = document.getElementById("terms-modal");
    const privacyModal = document.getElementById("privacy-modal");

    function openModal(modal) {
      if (!modal) return;
      modal.classList.add("clt-state-open");
      modal.setAttribute("aria-hidden", "false");
      const panel = modal.querySelector(".clt-home-legal-modal.panel");
      const backdrop = modal.querySelector(".clt-home-legal-modal.backdrop");
      gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.out" });
      gsap.fromTo(panel,
        { scale: 0.96, y: 18, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.42, ease: "power2.out", delay: 0.06 }
      );
      if (lenis) lenis.stop();
      document.body.style.overflow = "hidden";
    }

    function closeModal(modal) {
      if (!modal) return;
      const panel = modal.querySelector(".clt-home-legal-modal.panel");
      const backdrop = modal.querySelector(".clt-home-legal-modal.backdrop");
      gsap.to(panel, { scale: 0.97, y: 14, opacity: 0, duration: 0.28, ease: "power2.in" });
      gsap.to(backdrop, {
        opacity: 0, duration: 0.3, delay: 0.1,
        onComplete() {
          modal.classList.remove("clt-state-open");
          modal.setAttribute("aria-hidden", "true");
          if (lenis) lenis.start();
          document.body.style.overflow = "";
        },
      });
    }

    if (termsBtn && termsModal) termsBtn.addEventListener("click", () => openModal(termsModal));
    if (privacyBtn && privacyModal) privacyBtn.addEventListener("click", () => openModal(privacyModal));

    [termsModal, privacyModal].forEach((modal) => {
      if (!modal) return;
      modal.querySelectorAll("[data-close]").forEach((el) => {
        el.addEventListener("click", () => closeModal(modal));
      });
      modal.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeModal(modal);
      });
    });
  }

  /* ── Smooth anchor links ─────────────────────────────────── */

  function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        const id = anchor.getAttribute("href");
        if (!id || id === "#") return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        const navShell = document.querySelector(".clt-navbar-shell");
        const navOffset = navShell ? -Math.ceil(navShell.getBoundingClientRect().height + 18) : -80;
        if (lenis) {
          lenis.scrollTo(target, { offset: navOffset, duration: 1.4 });
        } else {
          const top = target.getBoundingClientRect().top + window.scrollY + navOffset;
          window.scrollTo({ top, behavior: "smooth" });
        }
      });
    });
  }

  /* ── Entry point ─────────────────────────────────────────── */

  document.addEventListener("DOMContentLoaded", async () => {
    canvas = document.getElementById("hero-canvas");
    ctx = canvas.getContext("2d");

    resizeCanvas();
    new ResizeObserver(resizeCanvas).observe(canvas);

    mainCtx = gsap.context(() => {});

    if (reducedMotion) {
      const img = new Image();
      img.onload = () => {
        frames[0] = img;
        drawFrame(0);
      };
      img.src = frameSrc(0);

      document
        .querySelectorAll('[data-gsap="home-hero-line"], [data-gsap="home-hero-eyebrow"], [data-gsap="home-hero-cta"]')
        .forEach((el) => {
          el.style.opacity = "1";
          el.style.transform = "none";
        });

      const reveal = document.querySelector('[data-gsap="home-hero-reveal"]');
      const cta = document.querySelector('[data-gsap="home-hero-cta"]');
      if (reveal) reveal.style.pointerEvents = "auto";
      if (cta) cta.style.pointerEvents = "auto";

      const stage = document.querySelector('[data-gsap="home-curtain-stage"]');
      if (stage) stage.style.display = "none";

      initDust(mainCtx);
      initMarquee(mainCtx);
      initExploreCarousel(mainCtx);
      initUpcomingEvents(mainCtx);
      initPastPerformances(mainCtx);
      initSubscribeDonate(mainCtx);
      initFooter(mainCtx);
      initSmoothAnchors();
      return;
    }

    frames = await preloadFrames();
    drawFrame(0);

    initLenis();
    initScrollScrub(mainCtx);
    initCurtain(mainCtx);
    initDust(mainCtx);
    initSectionParallax(mainCtx);
    initMarquee(mainCtx);
    initExploreCarousel(mainCtx);
    initUpcomingEvents(mainCtx);
    initPastPerformances(mainCtx);
    initSubscribeDonate(mainCtx);
    initFooter(mainCtx);
    initSmoothAnchors();
  });
})();
