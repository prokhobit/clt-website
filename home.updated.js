/* Homepage memory + native-touch revision. Replace earlier home scripts; load once after GSAP and core. */
window.CLT_HERO_FRAMES = [
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
];

(function () {
  "use strict";

  var win = window;
  var doc = document;
  if (win.__cltHomeLoaded) {
    win.console.warn("[CLT home] Duplicate homepage script ignored. Load only home.optimized.js.");
    return;
  }
  win.__cltHomeLoaded = true;
  win.CLT_HOME_VERSION = "2026-09-19-poster-rail-pause-hover";

  var SELECTOR = {
    heroSection: ".home-hero",
    heroCanvas: ".home-hero__canvas",
    heroLine:
      ".home-hero .clt-eyebrow, .home-hero .clt-page-hero__title, .home-hero .home-hero__presents",
    heroCue: ".home-hero__cue",

    marqueeRoot: ".home-marquee .clt-marquee",
    marqueeTrack: ".clt-marquee__track",

    pastViewport: ".clt-poster-rail",
    pastTrack: "[data-home-past]",
    pastItem: ".clt-poster-rail__item",
    pastPoster: ".clt-poster-rail__art .clt-poster",

    exploreSection: ".clt-home-explore",
    exploreMask: ".clt-home-explore.is-track-mask",
    exploreTrack: ".clt-home-explore.is-track",
    exploreCard: ".clt-home-explore.is-card",
    exploreCardImage: ".clt-home-explore.is-card-img",
    exploreCardStatic: ".clt-home-explore.is-card-static",
    exploreCardOverlay: ".clt-home-explore.is-card-overlay",
    exploreCardOverlayInner: ".clt-home-explore.is-card-overlay-inner",
    exploreCardOverlayItem:
      ".clt-home-explore.is-card-desc, .clt-home-explore.is-card-sep, .clt-home-explore.is-card-meta",
    cursorLens: ".clt-cursor-lens",

    zoomSection: ".home-zoom",
    zoomFigure: ".home-zoom__fig",
    zoomCaption: ".home-zoom__cap",
    zoomTitle: ".home-zoom__title",
    zoomCenterFigure: ".home-zoom__fig.is-1",
    zoomOverlay: ".home-zoom__overlay",
    zoomOverlayItems:
      ".home-zoom__overlay .clt-eyebrow, .home-zoom__overlay-title, .home-zoom__overlay-copy, .home-zoom__overlay .clt-button",

    reveal:
      ".home-marquee[data-reveal], .clt-home-explore.is-header[data-reveal], .home-section__head[data-reveal], .clt-panel[data-reveal], .clt-poster-rail__item[data-reveal]",
  };

  var state = {
    gsap: null,
    ScrollTrigger: null,
    CLT: null,
    mainContext: null,
    contextIgnore: null,
    reduced: false,
    cleanups: [],
  };

  function query(selector, root) {
    return (root || doc).querySelector(selector);
  }

  function queryAll(selector, root) {
    return Array.prototype.slice.call((root || doc).querySelectorAll(selector));
  }

  function listen(target, eventName, handler, options) {
    if (!target || !target.addEventListener) return function () {};
    target.addEventListener(eventName, handler, options || false);
    var cleanup = function () {
      target.removeEventListener(eventName, handler, options || false);
    };
    state.cleanups.push(cleanup);
    return cleanup;
  }

  function runOutsideContext(callback) {
    var result;

    if (typeof state.contextIgnore === "function") {
      state.contextIgnore(function () {
        result = callback();
      });

      return result;
    }

    return callback();
  }

  function killQuickTo(quickToFn) {
    if (
      quickToFn &&
      quickToFn.tween &&
      typeof quickToFn.tween.kill === "function"
    ) {
      quickToFn.tween.kill();
    }
  }

  function addTick(handler) {
    var lastTime = null, disposed = false;
    function tick(time) {
      if (disposed || doc.hidden) { lastTime = null; return; }
      var delta = lastTime === null ? 16.7 : Math.min(50, Math.max(0, (time - lastTime) * 1000));
      lastTime = time;
      handler(time, delta);
    }
    var remove;
    if (state.CLT && typeof state.CLT._addTick === "function") {
      remove = state.CLT._addTick(tick);
    } else if (state.gsap && state.gsap.ticker) {
      state.gsap.ticker.add(tick);
      remove = function () { state.gsap.ticker.remove(tick); };
    }
    state.cleanups.push(function () {
      disposed = true;
      if (typeof remove === "function") remove();
    });
  }

  function onResizeSettled(callback) {
    var timer;
    listen(win, "resize", function () {
      win.clearTimeout(timer);
      timer = win.setTimeout(callback, 180);
    }, { passive: true });
    state.cleanups.push(function () { win.clearTimeout(timer); });
  }

  function prepareLoopClone(clone) {
    var hadReveal = clone.hasAttribute("data-reveal") || clone.hasAttribute("data-clt-reveal");
    if (hadReveal) state.gsap.set(clone, { clearProps: "opacity,visibility,transform" });
    clone.removeAttribute("data-clt-reveal");
    clone.removeAttribute("id");
    clone.removeAttribute("data-reveal");
    queryAll("[id]", clone).forEach(function (el) { el.removeAttribute("id"); });
    [clone].concat(queryAll("a,button,input,select,textarea,[tabindex]", clone)).forEach(function (el) {
      el.setAttribute("tabindex", "-1");
    });
  }

  function getGSAPGlobal(name) {
    var gsap = state.gsap || win.gsap;
    if (win[name]) return win[name];
    if (gsap && gsap.core && typeof gsap.core.globals === "function") {
      var globals = gsap.core.globals();
      if (globals && globals[name]) return globals[name];
    }
    return null;
  }

  function activateAvailablePlugins() {
    var gsap = state.gsap;
    if (!gsap) return;

    var activate = gsap["register" + "Plugin"];
    if (typeof activate !== "function") return;

    var plugins = [
      state.ScrollTrigger,
    ].filter(Boolean);

    if (plugins.length) {
      activate.apply(gsap, plugins);
    }
  }

  function getScrollPosition() {
    var CLT = state.CLT;
    if (CLT && CLT.lenis && typeof CLT.lenis.scroll === "number") {
      return CLT.lenis.scroll;
    }
    return win.pageYOffset || doc.documentElement.scrollTop || 0;
  }

  function wrapNegativeX(x, width) {
    if (!width) return 0;
    return ((x % -width) + -width) % -width;
  }

  function initHeroScrub() {
    var gsap = state.gsap;
    var ScrollTrigger = state.ScrollTrigger;
    var clamp = gsap.utils.clamp;
    var section = query(SELECTOR.heroSection);
    var canvas = query(SELECTOR.heroCanvas, section);
    var urls = win.CLT_HERO_FRAMES || [];
    if (!section || !canvas || !urls.length) return;
    var context = canvas.getContext("2d", { alpha: false });
    if (!context) return;

    var reduced = state.reduced;
    var isMobileLike = win.matchMedia("(max-width: 760px), (pointer: coarse)").matches;
    var staticFrame = reduced || !ScrollTrigger;
    var step = isMobileLike ? 4 : 2;
    var total = urls.length;
    var cfg = win.CLT_HOME_CONFIG || {};
    function option(name, fallback, min, max) {
      var value = Number(cfg[name]);
      return Number.isFinite(value) && value > 0 ? Math.round(clamp(min, max, value)) : fallback;
    }
    // These bounds apply to application-owned, downsampled canvas buffers.
    // Browser image decoder / network / GPU caches remain browser-controlled.
    var cacheLimit = staticFrame ? 1 : option("heroCacheFrames", isMobileLike ? 6 : 10, 2, 16);
    var maxPixels = option("heroMaxPixels", isMobileLike ? 750000 : 1500000, 150000, 2073600);
    var concurrency = isMobileLike ? 2 : 3;
    var cache = new Map(), pending = new Map(), failed = new Map();
    var wanted = [], queue = [];
    var currentFrame = 0, lastDrawn = -1;
    var cssWidth = 0, cssHeight = 0, pixelRatio = 0;
    var disposed = false, nearViewport = true, paintFrame = 0;
    var bufferWidth = 1, bufferHeight = 1;

    function normalizeFrame(index) {
      return staticFrame ? 0 : clamp(0, total - 1, Math.round(index / step) * step);
    }
    function enabled() { return !disposed && nearViewport && !doc.hidden; }
    function releaseBuffer(entry) {
      entry.canvas.width = 0;
      entry.canvas.height = 0;
    }
    function clearCache() {
      cache.forEach(releaseBuffer);
      cache.clear();
      lastDrawn = -1;
    }
    function cancelPending() {
      pending.forEach(function (job) {
        job.image.onload = job.image.onerror = null;
        job.image.removeAttribute("src");
      });
      pending.clear();
      queue = [];
    }
    function trimForInsert() {
      if (cache.size < cacheLimit) return;
      var victim = null, distance = -1;
      cache.forEach(function (_entry, index) {
        var d = Math.abs(index - currentFrame);
        if (d > distance) { distance = d; victim = index; }
      });
      if (victim !== null) { releaseBuffer(cache.get(victim)); cache.delete(victim); }
    }
    function paint() {
      paintFrame = 0;
      if (!enabled() || !cache.size) return;
      var closest = null, distance = Infinity;
      cache.forEach(function (_entry, index) {
        var d = Math.abs(index - currentFrame);
        if (d < distance) { closest = index; distance = d; }
      });
      if (closest === lastDrawn) return;
      context.drawImage(cache.get(closest).canvas, 0, 0, canvas.width, canvas.height);
      lastDrawn = closest;
    }
    function schedulePaint() {
      if (!paintFrame && enabled()) paintFrame = win.requestAnimationFrame(paint);
    }
    function pump() {
      if (!enabled()) return;
      while (pending.size < concurrency && queue.length) {
        var index = queue.shift();
        if (cache.has(index) || pending.has(index)) continue;
        var retryAt = failed.get(index) || 0;
        if (retryAt > Date.now()) continue;
        load(index);
      }
    }
    function load(index) {
      var image = new Image();
      var job = { image: image };
      pending.set(index, job);
      image.decoding = "async";
      image.onload = function () {
        if (pending.get(index) !== job) return;
        pending.delete(index);
        if (enabled() && wanted.indexOf(index) !== -1 && image.naturalWidth) {
          trimForInsert();
          var buffer = doc.createElement("canvas");
          buffer.width = bufferWidth;
          buffer.height = bufferHeight;
          var target = buffer.getContext("2d", { alpha: false });
          if (target) {
            var scale = Math.max(bufferWidth / image.naturalWidth, bufferHeight / image.naturalHeight);
            var width = image.naturalWidth * scale, height = image.naturalHeight * scale;
            target.drawImage(image, (bufferWidth - width) / 2, (bufferHeight - height) / 2, width, height);
            cache.set(index, { canvas: buffer });
            schedulePaint();
          } else { buffer.width = buffer.height = 0; }
        }
        image.onload = image.onerror = null;
        image.removeAttribute("src");
        pump();
      };
      image.onerror = function () {
        if (pending.get(index) !== job) return;
        pending.delete(index);
        failed.set(index, Date.now() + 30000);
        image.onload = image.onerror = null;
        image.removeAttribute("src");
        pump();
      };
      image.src = urls[index];
    }
    function drawFrame(index) {
      currentFrame = normalizeFrame(index);
      if (!enabled()) return;
      wanted = [currentFrame];
      // Current frame first, then a small window around it. Never preload the sequence.
      for (var distance = 1; wanted.length < cacheLimit && distance < total; distance++) {
        var ahead = currentFrame + distance * step;
        var behind = currentFrame - distance * step;
        if (ahead < total) wanted.push(ahead);
        if (wanted.length < cacheLimit && behind >= 0) wanted.push(behind);
      }
      queue = wanted.filter(function (frame) { return !cache.has(frame) && !pending.has(frame); });
      schedulePaint();
      pump();
    }
    function resizeCanvas() {
      var rect = canvas.getBoundingClientRect();
      var nextWidth = Math.max(1, Math.round(rect.width || win.innerWidth));
      var nextHeight = Math.max(1, Math.round(rect.height || win.innerHeight));
      var dpr = Math.min(win.devicePixelRatio || 1, isMobileLike ? 1.25 : 1.5);
      if (nextWidth === cssWidth && nextHeight === cssHeight && dpr === pixelRatio) return;
      cssWidth = nextWidth; cssHeight = nextHeight; pixelRatio = dpr;
      var scale = Math.min(dpr, Math.sqrt(maxPixels / (nextWidth * nextHeight)));
      bufferWidth = Math.max(1, Math.floor(nextWidth * scale));
      bufferHeight = Math.max(1, Math.floor(nextHeight * scale));
      cancelPending();
      clearCache();
      canvas.width = bufferWidth;
      canvas.height = bufferHeight;
      drawFrame(currentFrame);
    }
    function suspend() {
      cancelPending();
      clearCache();
      if (paintFrame) win.cancelAnimationFrame(paintFrame);
      paintFrame = 0;
      // Keep the one visible canvas bitmap, preventing a blank flash on return.
    }
    resizeCanvas();
    if ("ResizeObserver" in win) {
      var resizeObserver = new ResizeObserver(resizeCanvas);
      resizeObserver.observe(canvas);
      state.cleanups.push(function () { resizeObserver.disconnect(); });
    } else { onResizeSettled(resizeCanvas); }
    if ("IntersectionObserver" in win) {
      var visibilityObserver = new IntersectionObserver(function (entries) {
        nearViewport = entries[0].isIntersecting;
        if (nearViewport) drawFrame(currentFrame); else suspend();
      }, { rootMargin: "25% 0px" });
      visibilityObserver.observe(section);
      state.cleanups.push(function () { visibilityObserver.disconnect(); });
    }
    listen(doc, "visibilitychange", function () {
      if (doc.hidden) suspend(); else drawFrame(currentFrame);
    });
    listen(win, "pagehide", suspend);
    listen(win, "pageshow", function () { drawFrame(currentFrame); });
    function stats() {
      var bytes = 0;
      cache.forEach(function (entry) { bytes += entry.canvas.width * entry.canvas.height * 4; });
      return { cachedFrames: cache.size, frameLimit: cacheLimit, inFlight: pending.size,
        concurrency: concurrency, cachedPixelBytes: bytes,
        displayPixelBytes: canvas.width * canvas.height * 4, maxPixels: maxPixels,
        currentFrame: currentFrame, displayedFrame: lastDrawn, active: enabled() };
    }
    if (cfg.debug === true) {
      win.CLT_HOME_DEBUG = win.CLT_HOME_DEBUG || {};
      win.CLT_HOME_DEBUG.hero = stats;
    }
    state.cleanups.push(function () {
      disposed = true;
      suspend();
      canvas.width = canvas.height = 1;
      if (win.CLT_HOME_DEBUG && win.CLT_HOME_DEBUG.hero === stats) delete win.CLT_HOME_DEBUG.hero;
    });

    var lines = queryAll(SELECTOR.heroLine, section);
    var cue = query(SELECTOR.heroCue, section);

    if (staticFrame) {
      drawFrame(0);
      gsap.set(lines, { autoAlpha: 1, y: 0 });
      if (cue) gsap.set(cue, { autoAlpha: 0 });
      return;
    }

    gsap.set(lines, { autoAlpha: 0, y: "2rem" });

    var revealTimeline = gsap.timeline({
      paused: true,
      defaults: { ease: "power3.out" },
    });
    revealTimeline.to(
      lines,
      { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.12 },
      0,
    );

    var revealStart = 0.62;
    var revealEnd = 0.96;

    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: function (self) {
        drawFrame(self.progress * (total - 1));

        var titleProgress = clamp(
          0,
          1,
          (self.progress - revealStart) / (revealEnd - revealStart),
        );
        revealTimeline.progress(titleProgress);

        if (cue) {
          gsap.set(cue, {
            autoAlpha: clamp(0, 1, 1 - self.progress * 6),
          });
        }
      },
    });
  }

  function initAcclaimMarquee() {
    var gsap = state.gsap;
    var ScrollTrigger = state.ScrollTrigger;
    var clamp = gsap.utils.clamp;
    var roots = queryAll(SELECTOR.marqueeRoot);

    if (!roots.length) return;

    var reduced = state.reduced;

    roots.forEach(function (root) {
      var tracks = queryAll(SELECTOR.marqueeTrack, root);
      if (!tracks.length) return;

      if (tracks.length === 1) {
        var clone = tracks[0].cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        root.appendChild(clone);
        tracks = queryAll(SELECTOR.marqueeTrack, root);
      }

      var firstTrack = tracks[0];
      var loopWidth = 1;
      var x = 0;
      var baseSpeed = 34;
      var direction = -1;
      var targetDirection = -1;
      var boost = 0;
      var targetBoost = 0;
      var active = true;
      var paused = false;
      var lastScroll = getScrollPosition();

      gsap.set(tracks, {
        x: 0,
        animation: "none",
        willChange: "transform",
        force3D: true,
      });

      function measure() {
        loopWidth = Math.max(
          1,
          firstTrack.getBoundingClientRect().width ||
            firstTrack.scrollWidth ||
            1,
        );

        x = wrapNegativeX(x, loopWidth);
        gsap.set(tracks, { x: x });
      }

      function setActive(value) {
        active = value;
        lastScroll = getScrollPosition();
      }

      measure();

      if (ScrollTrigger) {
        ScrollTrigger.create({
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          onEnter: function () {
            setActive(true);
          },
          onEnterBack: function () {
            setActive(true);
          },
          onLeave: function () {
            setActive(false);
          },
          onLeaveBack: function () {
            setActive(false);
          },
        });

        ScrollTrigger.addEventListener("refreshInit", measure);
        state.cleanups.push(function () {
          ScrollTrigger.removeEventListener("refreshInit", measure);
        });
      }

      onResizeSettled(measure);

      listen(
        root,
        "pointerenter",
        function () {
          paused = true;
        },
        { passive: true },
      );

      listen(
        root,
        "pointerleave",
        function () {
          paused = false;
          lastScroll = getScrollPosition();
        },
        { passive: true },
      );

      if (reduced) {
        gsap.set(tracks, { x: 0, animation: "none", clearProps: "willChange" });
        return;
      }

      addTick(function (_time, deltaMilliseconds) {
        if (!active || paused) return;

        var deltaSeconds = Math.min(
          0.05,
          Math.max(0.001, (deltaMilliseconds || 16.7) / 1000),
        );
        var scroll = getScrollPosition();
        var scrollDelta = scroll - lastScroll;
        lastScroll = scroll;

        if (Math.abs(scrollDelta) > 0.08) {
          targetDirection = scrollDelta > 0 ? -1 : 1;
          targetBoost = clamp(
            0,
            220,
            Math.abs(scrollDelta / deltaSeconds) * 0.12,
          );
        } else {
          targetBoost = 0;
        }

        direction += (targetDirection - direction) * 0.08;
        boost += (targetBoost - boost) * 0.12;

        var speed = baseSpeed + boost;
        x = wrapNegativeX(x + direction * speed * deltaSeconds, loopWidth);

        gsap.set(tracks, { x: x });
      });
    });
  }

  // On touch devices, one browser-owned scroll surface: no clones, transforms,
  // custom inertia, pointer capture, or window-level move listeners.
  function initNativeRail(viewport, track, label) {
    viewport.classList.add("clt-home-native-scroll");
    track.classList.add("clt-home-native-track");
    Object.assign(viewport.style, {
      overflowX: "auto", overflowY: "hidden", touchAction: "auto",
      transform: "none", maskImage: "none", webkitMaskImage: "none"
    });
    Object.assign(track.style, {
      display: "flex", flexWrap: "nowrap", width: "max-content",
      transform: "none", translate: "none", touchAction: "auto",
      willChange: "auto", transition: "none"
    });
    queryAll('[data-clone="true"]', track).forEach(function (clone) { clone.remove(); });
    delete track.dataset.clonesReady;
    if (!viewport.hasAttribute("tabindex")) viewport.tabIndex = 0;
    if (!viewport.hasAttribute("role")) viewport.setAttribute("role", "region");
    if (!viewport.hasAttribute("aria-label") && !viewport.hasAttribute("aria-labelledby")) {
      viewport.setAttribute("aria-label", label);
    }
    queryAll("img", track).forEach(function (image) {
      image.decoding = "async";
      if (!image.hasAttribute("loading")) image.loading = "lazy";
      image.draggable = false;
    });
  }

  // Animate scrollLeft only while idle. Touch gestures and their momentum remain
  // entirely browser-owned; wrapping is deferred until native scrolling settles.
  function initNativeAutoScroll(viewport, track) {
    var motion = win.matchMedia("(prefers-reduced-motion: reduce)");
    var originals = Array.prototype.slice.call(track.children);
    if (motion.matches || originals.length < 2) return;
    var clones = originals.map(function (item) {
      var clone = item.cloneNode(true);
      clone.dataset.clone = "true";
      clone.setAttribute("aria-hidden", "true");
      prepareLoopClone(clone);
      queryAll("img", clone).forEach(function (img) { img.loading = "lazy"; img.decoding = "async"; });
      track.appendChild(clone);
      return clone;
    });
    var button = doc.createElement("button");
    button.type = "button";
    button.className = "clt-home-auto-toggle";
    button.textContent = "Pause auto-scroll";
    button.setAttribute("aria-label", "Pause Explore automatic scrolling");
    button.setAttribute("aria-pressed", "false");
    viewport.insertAdjacentElement("afterend", button);
    var pitch = 0, frame = 0, timer = 0, previous = null, position = viewport.scrollLeft;
    var written = null, touching = false, mouseDown = false, focused = false;
    var paused = false, visible = false, away = false, destroyed = false;
    var resumeAt = performance.now() + 1200;
    var configuredSpeed = Number((win.CLT_HOME_CONFIG || {}).exploreAutoSpeed);
    var speed = Number.isFinite(configuredSpeed) && configuredSpeed > 0
      ? Math.max(8, Math.min(50, configuredSpeed)) : 24;
    function stop() {
      if (frame) win.cancelAnimationFrame(frame);
      win.clearTimeout(timer);
      frame = timer = 0;
      previous = null;
    }
    function allowed() {
      return !destroyed && !paused && !motion.matches && visible && !away && !doc.hidden &&
        !touching && !mouseDown && !focused && pitch > 0 &&
        viewport.scrollWidth - viewport.clientWidth >= pitch;
    }
    function write(value) {
      viewport.scrollLeft = value;
      written = viewport.scrollLeft;
    }
    function tick(now) {
      frame = 0;
      if (!allowed()) { stop(); return; }
      var dt = previous === null ? 0 : Math.min(0.05, (now - previous) / 1000);
      previous = now;
      position = (position + speed * dt) % pitch;
      write(position);
      frame = win.requestAnimationFrame(tick);
    }
    function sync() {
      stop();
      if (!allowed()) return;
      var wait = resumeAt - performance.now();
      if (wait > 0) { timer = win.setTimeout(sync, wait + 1); return; }
      position = ((viewport.scrollLeft % pitch) + pitch) % pitch;
      write(position);
      frame = win.requestAnimationFrame(tick);
    }
    function interaction() { resumeAt = performance.now() + 3000; sync(); }
    function measure() {
      pitch = clones[0].offsetLeft - originals[0].offsetLeft;
      button.hidden = !(pitch > 0 && viewport.scrollWidth - viewport.clientWidth >= pitch);
      interaction();
    }
    listen(viewport, "touchstart", function () { touching = true; interaction(); }, { passive: true });
    function endTouch(event) { touching = event.touches.length > 0; interaction(); }
    listen(win, "touchend", endTouch, { passive: true });
    listen(win, "touchcancel", endTouch, { passive: true });
    listen(viewport, "pointerdown", function (event) {
      if (event.pointerType === "touch") return;
      mouseDown = true; interaction();
    }, { passive: true });
    function endPointer(event) {
      if (event.pointerType === "touch") return;
      mouseDown = false; interaction();
    }
    listen(win, "pointerup", endPointer, { passive: true });
    listen(win, "pointercancel", endPointer, { passive: true });
    listen(viewport, "wheel", interaction, { passive: true });
    listen(viewport, "focusin", function () { focused = true; interaction(); });
    listen(viewport, "focusout", function (event) {
      focused = Boolean(event.relatedTarget && viewport.contains(event.relatedTarget));
      interaction();
    });
    listen(viewport, "scroll", function () {
      if (written !== null && Math.abs(viewport.scrollLeft - written) < 0.5) return;
      written = null;
      interaction();
    }, { passive: true });
    listen(button, "click", function () {
      paused = !paused;
      button.textContent = paused ? "Resume auto-scroll" : "Pause auto-scroll";
      button.setAttribute("aria-label", (paused ? "Resume" : "Pause") + " Explore automatic scrolling");
      button.setAttribute("aria-pressed", String(paused));
      resumeAt = performance.now();
      sync();
    });
    listen(doc, "visibilitychange", interaction);
    listen(win, "blur", function () { touching = mouseDown = false; interaction(); });
    listen(win, "pagehide", function () { away = true; stop(); });
    listen(win, "pageshow", function () { away = false; interaction(); });
    if (motion.addEventListener) listen(motion, "change", sync);
    if ("IntersectionObserver" in win) {
      var observer = new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        sync();
      });
      observer.observe(viewport);
      state.cleanups.push(function () { observer.disconnect(); });
    } else { visible = true; }
    if ("ResizeObserver" in win) {
      var resizeObserver = new ResizeObserver(measure);
      resizeObserver.observe(viewport);
      resizeObserver.observe(track);
      state.cleanups.push(function () { resizeObserver.disconnect(); });
    } else { onResizeSettled(measure); }
    measure();
    state.cleanups.push(function () {
      destroyed = true;
      stop();
      clones.forEach(function (clone) { clone.remove(); });
      button.remove();
    });
  }

  function initPosterArchive() {
    var gsap = state.gsap;
    var ScrollTrigger = state.ScrollTrigger;
    var clamp = gsap.utils.clamp;
    var viewport = query(SELECTOR.pastViewport);
    var track = query(SELECTOR.pastTrack, viewport || doc);

    if (!viewport || !track) return;

    var reduced = state.reduced;
    var isTouch = win.matchMedia("(hover: none), (pointer: coarse)").matches;
    if (isTouch) { initNativeRail(viewport, track, "Poster archive"); return; }
    var originals = queryAll(SELECTOR.pastItem, track).filter(function (item) {
      return item.dataset.clone !== "true";
    });

    if (originals.length < 2) return;

    if (track.dataset.clonesReady !== "true") {
      originals.forEach(function (item) {
        var clone = item.cloneNode(true);
        clone.dataset.clone = "true";
        clone.setAttribute("aria-hidden", "true");
        prepareLoopClone(clone);
        track.appendChild(clone);
      });
      track.dataset.clonesReady = "true";
    }

    var setWidth = 1;
    var velocity = 0;
    var dragging = false;
    var paused = false;
    var hovered = false, focused = false, resumeFactor = 0;
    var active = true;
    var momentumTween = null;
    var previousScroll = getScrollPosition();

    gsap.set(viewport, {
      overflow: "hidden",
      touchAction: "pan-y",
    });

    // No persistent will-change here: promoting every poster + clone to its own GPU
    // layer at rest is a memory/jank cost.
    gsap.set(track, {
      x: 0,
      overflow: "visible",
      scrollSnapType: "none",
      force3D: true,
    });

    var writeTrackX = gsap.quickSetter(track, "x", "px");
    function setTrackX(value) {
      writeTrackX(wrapNegativeX(value, setWidth));
    }

    function measure() {
      var firstClone = track.querySelector('[data-clone="true"]');
      setWidth = Math.max(1, firstClone ? firstClone.offsetLeft - originals[0].offsetLeft : track.scrollWidth / 2);
      setTrackX(Number(gsap.getProperty(track, "x")) || 0);
    }

    function isDragging() {
      return dragging;
    }

    function setPaused() {
      paused = hovered || focused;
      resumeFactor = 0;
      if (paused && momentumTween) { momentumTween.kill(); momentumTween = null; velocity = 0; }
      viewport.classList.toggle("is-paused", paused || dragging);
      previousScroll = getScrollPosition();
    }

    function releaseMomentum() {
      var startX = Number(gsap.getProperty(track, "x")) || 0;
      var distance = velocity * 0.42;
      var duration = clamp(0.42, 1.65, Math.abs(velocity) / 820);
      var proxy = { progress: 0 };

      if (momentumTween) momentumTween.kill();
      if (paused || reduced || Math.abs(velocity) < 35) return;

      momentumTween = gsap.to(proxy, {
        progress: 1,
        duration: duration,
        ease: "power3.out",
        onUpdate: function () {
          setTrackX(startX + distance * proxy.progress);
        },
        onComplete: function () {
          velocity = 0;
        },
      });
    }

    function pressStart() {
      dragging = true;
      viewport.classList.add("is-dragging");
      if (momentumTween) momentumTween.kill();
    }

    function pressEnd() {
      dragging = false;
      viewport.classList.remove("is-dragging");
      previousScroll = getScrollPosition();
    }

    // Poster items are CSS-sized (fixed clamp width + 2/3 aspect-ratio), so
    // track.scrollWidth is correct at init regardless of image load — no media-
    // ready re-measure needed. (Layout shifts are handled by refreshAfterLayoutSettles
    // and the refreshInit listener below; a per-image ScrollTrigger.refresh() here
    // fired mid-scroll and corrupted clt-core's batched reveals + the zoom scrub.)
    measure();

    if (ScrollTrigger) {
      ScrollTrigger.create({
        trigger: viewport,
        start: "top bottom",
        end: "bottom top",
        onEnter: function () {
          active = true;
          previousScroll = getScrollPosition();
        },
        onEnterBack: function () {
          active = true;
          previousScroll = getScrollPosition();
        },
        onLeave: function () {
          active = false;
        },
        onLeaveBack: function () {
          active = false;
        },
      });

      ScrollTrigger.addEventListener("refreshInit", measure);
      state.cleanups.push(function () {
        ScrollTrigger.removeEventListener("refreshInit", measure);
      });
    }

    onResizeSettled(measure);

    listen(viewport, "pointerenter", function (event) {
      if (event.pointerType !== "mouse") return;
      hovered = true;
      setPaused();
    });

    listen(viewport, "pointerleave", function (event) {
      if (event.pointerType !== "mouse") return;
      hovered = false;
      setPaused();
    });

    listen(viewport, "focusin", function () {
      focused = true;
      setPaused();
    });
    listen(viewport, "focusout", function (event) {
      focused = Boolean(event.relatedTarget && viewport.contains(event.relatedTarget));
      setPaused();
    });

    initPointerDragFallback(viewport, track, null, setTrackX, isDragging,
      function (nextVelocity) { velocity = nextVelocity; },
      releaseMomentum, pressStart, pressEnd);
    state.cleanups.push(function () { if (momentumTween) momentumTween.kill(); });

    if (reduced) return;

    addTick(function (_time, deltaMilliseconds) {
      if (
        !active ||
        paused ||
        isDragging() ||
        (momentumTween && momentumTween.isActive())
      ) {
        return;
      }

      var deltaSeconds = Math.min(
        0.05,
        Math.max(0.001, (deltaMilliseconds || 16.7) / 1000),
      );
      var scroll = getScrollPosition();
      var scrollDelta = scroll - previousScroll;
      previousScroll = scroll;

      var currentX = Number(gsap.getProperty(track, "x")) || 0;
      // Ease back to full speed over a few frames without moving on hover.
      resumeFactor += (1 - resumeFactor) * (1 - Math.exp(-deltaSeconds / 0.16));
      var autoStep = -30 * deltaSeconds * resumeFactor;
      var scrollPush = clamp(-22, 22, scrollDelta * -0.24) * resumeFactor;
      setTrackX(currentX + autoStep + scrollPush);

    });
  }

  function initExploreCarousel() {
    var gsap = state.gsap;
    var ScrollTrigger = state.ScrollTrigger;
    var clamp = gsap.utils.clamp;
    var section = query(SELECTOR.exploreSection);
    var mask = query(SELECTOR.exploreMask, section);
    var track = query(SELECTOR.exploreTrack, section);

    if (!section || !mask || !track) return;

    var reduced = state.reduced;
    var isTouch = win.matchMedia("(hover: none), (pointer: coarse)").matches;
    if (isTouch) {
      initNativeRail(mask, track, "Explore");
      initNativeAutoScroll(mask, track);
      return;
    }
    mask.style.overflow = "hidden";

    var originals = queryAll(SELECTOR.exploreCard, track).filter(
      function (card) {
        return card.dataset.clone !== "true";
      },
    );

    if (!originals.length) return;

    if (track.dataset.clonesReady !== "true") {
      originals.forEach(function (card) {
        var clone = card.cloneNode(true);
        clone.dataset.clone = "true";
        clone.setAttribute("aria-hidden", "true");
        prepareLoopClone(clone);
        // Let browser proximity decide when duplicate imagery needs decoding.
        var cloneImgs = clone.querySelectorAll("img");
        for (var ci = 0; ci < cloneImgs.length; ci++) {
          cloneImgs[ci].setAttribute("loading", "lazy");
          cloneImgs[ci].setAttribute("decoding", "async");
        }
        track.appendChild(clone);
      });

      track.dataset.clonesReady = "true";
    }

    var allCards = queryAll(SELECTOR.exploreCard, track);
    var setWidth = 1;
    var momentumTween = null;
    var dragging = false;
    var velocity = 0;

    function measure() {
      var firstClone = track.querySelector('[data-clone="true"]');
      setWidth = Math.max(1, firstClone ? firstClone.offsetLeft - originals[0].offsetLeft : track.scrollWidth / 2);
      setTrackX(Number(gsap.getProperty(track, "x")) || 0);
    }

    var writeTrackX = gsap.quickSetter(track, "x", "px");
    function setTrackX(value) {
      writeTrackX(wrapNegativeX(value, setWidth));
    }

    function isDragging() {
      return dragging;
    }

    function releaseMomentum() {
      var startX = Number(gsap.getProperty(track, "x")) || 0;
      var distance = velocity * 0.34;
      var duration = clamp(0.35, 1.8, Math.abs(velocity) / 760);
      var proxy = { progress: 0 };

      if (momentumTween) momentumTween.kill();
      if (reduced || Math.abs(velocity) < 35) return;

      momentumTween = gsap.to(proxy, {
        progress: 1,
        duration: duration,
        ease: "power3.out",
        onUpdate: function () {
          setTrackX(startX + distance * proxy.progress);
        },
      });
    }

    measure();

    if (ScrollTrigger) {
      ScrollTrigger.addEventListener("refreshInit", measure);
      state.cleanups.push(function () {
        ScrollTrigger.removeEventListener("refreshInit", measure);
      });
    }

    onResizeSettled(measure);

    gsap.fromTo(
      section,
      {
        autoAlpha: 0,
        y: reduced ? 0 : "3rem",
      },
      {
        autoAlpha: 1,
        y: 0,
        duration: reduced ? 0 : 0.8,
        ease: "power3.out",
        scrollTrigger: !reduced && ScrollTrigger
          ? {
              trigger: section,
              start: "top 90%",
              toggleActions: "play none none reverse",
            }
          : null,
      },
    );

    initExploreCardHovers(allCards, isDragging, reduced, isTouch);
    var lens = initExploreLens(mask, clamp, isDragging, reduced, isTouch);

    initPointerDragFallback(mask, track, lens, setTrackX, isDragging,
      function (nextVelocity) { velocity = nextVelocity; }, releaseMomentum,
      function () {
        dragging = true;
        if (momentumTween) momentumTween.kill();
      },
      function () { dragging = false; previousScroll = getScrollPosition(); });
    state.cleanups.push(function () { if (momentumTween) momentumTween.kill(); });

    var previousScroll = getScrollPosition();

    var scrollFrame = 0;
    function onScrollFrame() {
      scrollFrame = 0;
      var scroll = getScrollPosition();
      var delta = scroll - previousScroll;
      previousScroll = scroll;

      if (reduced || delta === 0 || isDragging() || (momentumTween && momentumTween.isActive())) return;

      var currentX = Number(gsap.getProperty(track, "x")) || 0;
      var push = clamp(-18, 18, delta * 0.55);

      if (push !== 0) {
        setTrackX(currentX - push);
      }
    }
    listen(win, "scroll", function () {
      if (!scrollFrame && !reduced) scrollFrame = win.requestAnimationFrame(onScrollFrame);
    }, { passive: true });
    state.cleanups.push(function () { win.cancelAnimationFrame(scrollFrame); });
  }

  // One horizontal gesture owner for both carousels. Safari can keep native
  // vertical scrolling / pinch zoom, while pointercancel never starts inertia.
  function initPointerDragFallback(mask, track, lens, setTrackX, isDragging,
    setVelocity, releaseMomentum, onPress, onRelease) {
    var activePointer = null, axis = null, frame = 0;
    var startX = 0, startY = 0, startTrackX = 0, nextX = 0;
    var lastX = 0, lastTime = 0, suppressClickUntil = 0;
    var oldTouchAction = mask.style.touchAction;
    mask.style.touchAction = "pan-y pinch-zoom";

    function render() {
      frame = 0;
      setTrackX(nextX);
    }
    function finish(cancelled) {
      if (activePointer === null) return;
      var id = activePointer, moved = axis === "x";
      activePointer = null;
      if (frame) {
        win.cancelAnimationFrame(frame);
        frame = 0;
        if (!cancelled && moved) render();
      }
      if (mask.hasPointerCapture && mask.hasPointerCapture(id)) {
        try { mask.releasePointerCapture(id); } catch (_) {}
      }
      if (moved) suppressClickUntil = performance.now() + 500;
      if (cancelled || performance.now() - lastTime > 100) setVelocity(0);
      mask.classList.remove("is-dragging");
      if (lens) lens.classList.remove("is-dragging");
      if (typeof onRelease === "function") onRelease();
      if (moved && !cancelled) releaseMomentum();
      axis = null;
    }

    listen(mask, "pointerdown", function (event) {
      if (event.isPrimary === false) { finish(true); return; }
      if (activePointer !== null || event.button !== 0 || isDragging()) return;
      if (event.target.closest("button,input,select,textarea,[contenteditable='true']")) return;
      suppressClickUntil = 0;
      activePointer = event.pointerId;
      axis = null;
      startX = lastX = event.clientX;
      startY = event.clientY;
      lastTime = performance.now();
      startTrackX = nextX = Number(state.gsap.getProperty(track, "x")) || 0;
      setVelocity(0);
      // Pause automatic transforms immediately, including while choosing an axis.
      if (typeof onPress === "function") onPress();
    }, { passive: true });

    listen(win, "pointermove", function (event) {
      if (event.pointerId !== activePointer) return;
      var dx = event.clientX - startX, dy = event.clientY - startY;
      if (!axis) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) < 8) return;
        if (Math.abs(dy) >= Math.abs(dx)) { finish(true); return; }
        axis = "x";
        mask.classList.add("is-dragging");
        if (lens) lens.classList.add("is-dragging");
        try { mask.setPointerCapture(activePointer); } catch (_) {}
      }
      if (event.cancelable) event.preventDefault();
      var now = performance.now();
      var speed = ((event.clientX - lastX) / Math.max(8, now - lastTime)) * 1000;
      setVelocity(Math.max(-2500, Math.min(2500, speed)));
      lastX = event.clientX;
      lastTime = now;
      nextX = startTrackX + dx;
      if (!frame) frame = win.requestAnimationFrame(render);
    }, { passive: false });
    listen(win, "pointerup", function (event) {
      if (event.pointerId === activePointer) finish(false);
    });
    listen(win, "pointercancel", function (event) {
      if (event.pointerId === activePointer) finish(true);
    });
    listen(mask, "lostpointercapture", function (event) {
      // Touch starts with implicit capture on the card; its bubbling loss is
      // expected when we transfer capture to the mask after axis lock.
      if (event.target === mask && event.pointerId === activePointer) finish(true);
    });
    listen(win, "pointerdown", function (event) {
      if (event.isPrimary === false) finish(true);
    }, { passive: true });
    listen(win, "blur", function () { finish(true); });
    listen(win, "pagehide", function () { finish(true); });
    listen(doc, "visibilitychange", function () { if (doc.hidden) finish(true); });
    listen(mask, "dragstart", function (event) { event.preventDefault(); });
    listen(mask, "click", function (event) {
      if (event.detail !== 0 && performance.now() < suppressClickUntil) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }, true);
    state.cleanups.push(function () {
      finish(true);
      mask.style.touchAction = oldTouchAction;
    });
  }

  function initExploreCardHovers(cards, isDragging, reduced, isTouch) {
    var gsap = state.gsap;

    if (!cards.length || isTouch) return;

    cards.forEach(function (card) {
      var image = query(SELECTOR.exploreCardImage, card);
      var staticLayer = query(SELECTOR.exploreCardStatic, card);
      var overlay = query(SELECTOR.exploreCardOverlay, card);
      var overlayInner = query(SELECTOR.exploreCardOverlayInner, card);
      var overlayItems = queryAll(SELECTOR.exploreCardOverlayItem, card);

      gsap.set(card, {
        scaleX: 0.95,
        scaleY: 0.95,
        filter: "brightness(0.7) saturate(0.82)",
        transformOrigin: "50% 50%",
        force3D: "auto",
      });

      gsap.set(image, {
        scaleX: 1.02,
        scaleY: 1.02,
        filter: "saturate(0.98) contrast(1)",
        transformOrigin: "50% 50%",
        force3D: "auto",
      });

      gsap.set(staticLayer, {
        y: 0,
        autoAlpha: 1,
        force3D: "auto",
      });

      gsap.set(overlay, {
        autoAlpha: 0,
        y: 18,
        force3D: "auto",
      });

      gsap.set(overlayInner, {
        autoAlpha: 0,
        y: 14,
        scaleX: 0.965,
        scaleY: 0.965,
        transformOrigin: "50% 100%",
        force3D: "auto",
      });

      gsap.set(overlayItems, {
        autoAlpha: 0,
        y: 8,
        force3D: "auto",
      });

      var timeline = gsap.timeline({
        paused: true,
        defaults: {
          ease: "power3.out",
          overwrite: "auto",
        },
      });

      timeline
        .to(
          card,
          {
            scaleX: 0.985,
            scaleY: 0.985,
            filter: "brightness(0.86) saturate(0.94)",
            duration: reduced ? 0.01 : 0.34,
          },
          0,
        )
        .to(
          image,
          {
            scaleX: 1.075,
            scaleY: 1.075,
            filter: "saturate(1.08) contrast(1.04)",
            duration: reduced ? 0.01 : 0.62,
            ease: "power2.out",
          },
          0,
        )
        .to(
          staticLayer,
          {
            y: -6,
            autoAlpha: 0.92,
            duration: reduced ? 0.01 : 0.34,
          },
          0,
        )
        .to(
          overlay,
          {
            autoAlpha: 1,
            y: 0,
            duration: reduced ? 0.01 : 0.32,
          },
          0.04,
        )
        .to(
          overlayInner,
          {
            autoAlpha: 1,
            y: 0,
            scaleX: 1,
            scaleY: 1,
            duration: reduced ? 0.01 : 0.44,
            ease: "expo.out",
          },
          0.06,
        )
        .to(
          overlayItems,
          {
            autoAlpha: 1,
            y: 0,
            duration: reduced ? 0.01 : 0.32,
            stagger: 0.035,
          },
          0.16,
        );

      listen(
        card,
        "pointerenter",
        function () {
          if (isDragging && isDragging()) return;

          card.classList.add("clt-state-hovered");
          timeline.timeScale(1).play();
        },
        { passive: true },
      );

      listen(
        card,
        "pointerleave",
        function () {
          card.classList.remove("clt-state-hovered");
          timeline.timeScale(1.35).reverse();
        },
        { passive: true },
      );

      listen(
        card,
        "pointerdown",
        function () {
          card.classList.remove("clt-state-hovered");
          timeline.timeScale(1.65).reverse();
        },
        { passive: true },
      );
    });
  }

  function initExploreLens(mask, clamp, isDragging, reduced, isTouch) {
    var gsap = state.gsap;
    var lens = query(SELECTOR.cursorLens);

    if (!lens || !mask || isTouch) return null;

    mask.classList.add("is-lens-on");

    var lensQuick = runOutsideContext(function () {
      gsap.set(lens, {
        x: 0,
        y: 0,
        xPercent: -50,
        yPercent: -50,
        rotation: 0,
        scaleX: 0.82,
        scaleY: 0.82,
        autoAlpha: 0,
        force3D: true,
      });

      return {
        moveX: gsap.quickTo(lens, "x", {
          duration: 0.16,
          ease: "power3.out",
        }),
        moveY: gsap.quickTo(lens, "y", {
          duration: 0.16,
          ease: "power3.out",
        }),
        rotate: gsap.quickTo(lens, "rotation", {
          duration: 0.24,
          ease: "power3.out",
        }),
        scaleXTo: gsap.quickTo(lens, "scaleX", {
          duration: 0.18,
          ease: "power3.out",
        }),
        scaleYTo: gsap.quickTo(lens, "scaleY", {
          duration: 0.18,
          ease: "power3.out",
        }),
      };
    });

    var moveX = lensQuick.moveX;
    var moveY = lensQuick.moveY;
    var rotate = lensQuick.rotate;
    var scaleXTo = lensQuick.scaleXTo;
    var scaleYTo = lensQuick.scaleYTo;
    var scaleTo = function (v) {
      scaleXTo(v);
      scaleYTo(v);
    };

    var isOver = false;
    var isDown = false;
    var lastX = 0;

    function show() {
      lens.classList.add("is-active");
      gsap.to(lens, {
        autoAlpha: 1,
        duration: reduced ? 0.01 : 0.16,
        ease: "power2.out",
        overwrite: "auto",
      });

      scaleTo(isDown ? 0.86 : 1);
    }

    function hide() {
      isOver = false;
      isDown = false;
      lens.classList.remove("is-active", "is-dragging");
      rotate(0);
      scaleTo(0.82);

      gsap.to(lens, {
        autoAlpha: 0,
        duration: reduced ? 0.01 : 0.18,
        ease: "power2.out",
        overwrite: "auto",
      });
    }

    function move(event) {
      var deltaX = event.clientX - lastX;
      lastX = event.clientX;

      moveX(event.clientX);
      moveY(event.clientY);

      if (isOver && !reduced && !(isDragging && isDragging())) {
        rotate(clamp(-10, 10, deltaX * 0.28));
      }
    }

    listen(
      mask,
      "pointerenter",
      function (event) {
        isOver = true;
        lastX = event.clientX;
        move(event);
        show();
      },
      { passive: true },
    );

    listen(
      mask,
      "pointermove",
      function (event) {
        if (!isOver) {
          isOver = true;
          show();
        }

        move(event);
      },
      { passive: true },
    );

    listen(mask, "pointerleave", hide, { passive: true });
    listen(win, "blur", hide, { passive: true });

    listen(
      mask,
      "pointerdown",
      function (event) {
        isDown = true;
        lens.classList.add("is-dragging");
        move(event);
        show();
        scaleTo(0.86);
        rotate(0);
      },
      { passive: true },
    );

    listen(
      win,
      "pointerup",
      function () {
        if (!isDown) return;

        isDown = false;
        lens.classList.remove("is-dragging");

        if (isOver) show();
        else hide();
      },
      { passive: true },
    );

    state.cleanups.push(function () {
      killQuickTo(moveX);
      killQuickTo(moveY);
      killQuickTo(rotate);
      killQuickTo(scaleXTo);
      killQuickTo(scaleYTo);
      gsap.killTweensOf(lens);
      lens.classList.remove("is-active", "is-dragging");
      mask.classList.remove("is-lens-on");
      gsap.set(lens, {
        x: 0,
        y: 0,
        rotation: 0,
        scaleX: 0.82,
        scaleY: 0.82,
        autoAlpha: 0,
      });
    });

    return lens;
  }

  function initZoomGallery() {
    var gsap = state.gsap;
    var ScrollTrigger = state.ScrollTrigger;
    var section = query(SELECTOR.zoomSection);
    var figures = queryAll(SELECTOR.zoomFigure, section);

    if (!section || !figures.length || !ScrollTrigger) return;

    var matchMedia = gsap.matchMedia();
    var title = query(SELECTOR.zoomTitle, section);
    var overlay = query(SELECTOR.zoomOverlay, section);
    var overlayItems = queryAll(SELECTOR.zoomOverlayItems, section);
    var centerFigure = query(SELECTOR.zoomCenterFigure, section) || figures[0];

    // Desktop: pinned collage. The center image grows until it owns the viewport;
    // the supporting stills recede, then the gallery action arrives over the image.
    matchMedia.add(
      "(min-width: 64rem) and (prefers-reduced-motion: no-preference)",
      function () {
        var sideFigures = figures.filter(function (figure) {
          return figure !== centerFigure;
        });

        function centerTargetScale() {
          var img = query("img", centerFigure);
          var rect = img
            ? img.getBoundingClientRect()
            : centerFigure.getBoundingClientRect();
          var width = Math.max(1, rect.width || win.innerWidth);
          var height = Math.max(1, rect.height || win.innerHeight);

          return (
            Math.max(win.innerWidth / width, win.innerHeight / height) * 1.055
          );
        }

        function syncZoomScrollBounds() {
          win.requestAnimationFrame(function () {
            var CLT = win.CLT;
            if (CLT && CLT.lenis && typeof CLT.lenis.resize === "function") {
              CLT.lenis.resize();
            }
            ScrollTrigger.update();
          });
        }

        var timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: function () {
              return "+=" + Math.max(1, section.offsetHeight - win.innerHeight);
            },
            scrub: 0.78,
            invalidateOnRefresh: true,
            onLeave: syncZoomScrollBounds,
            onEnterBack: syncZoomScrollBounds,
          },
        });

        gsap.set(figures, {
          autoAlpha: 1,
          willChange: "transform, opacity",
          force3D: true,
        });
        gsap.set(centerFigure, {
          zIndex: 5,
          transformOrigin:
            centerFigure.getAttribute("data-zoom-origin") || "50% 50%",
        });
        gsap.set(sideFigures, { zIndex: 6 });

        if (overlay) {
          gsap.set(overlay, {
            autoAlpha: 0,
            y: 26,
            scaleX: 0.982,
            scaleY: 0.982,
            pointerEvents: "none",
            willChange: "transform, opacity",
            force3D: true,
          });
        }

        if (overlayItems.length) {
          gsap.set(overlayItems, {
            autoAlpha: 0,
            y: 18,
            willChange: "transform, opacity",
          });
        }

        if (title) {
          gsap.set(title, { willChange: "transform, opacity" });
          timeline
            .fromTo(
              title,
              { autoAlpha: 0, scaleX: 0.94, scaleY: 0.94, yPercent: 12 },
              {
                autoAlpha: 1,
                scaleX: 1,
                scaleY: 1,
                yPercent: 0,
                ease: "power2.out",
                duration: 0.18,
              },
              0,
            )
            .to(
              title,
              {
                autoAlpha: 0,
                yPercent: -9,
                ease: "power2.inOut",
                duration: 0.22,
              },
              0.38,
            );
        }

        sideFigures.forEach(function (figure, index) {
          var cap = figure.querySelector(SELECTOR.zoomCaption);
          var flyPath = [
            {
              xPercent: -30,
              yPercent: -22,
              z: 520,
              rotation: -8,
              rotationX: 5,
              rotationY: -10,
              scale: 2.35,
            },
            {
              xPercent: 34,
              yPercent: -16,
              z: 620,
              rotation: 7,
              rotationX: 4,
              rotationY: 12,
              scale: 2.55,
            },
            {
              xPercent: -34,
              yPercent: 25,
              z: 580,
              rotation: 6,
              rotationX: -7,
              rotationY: -8,
              scale: 2.48,
            },
            {
              xPercent: 32,
              yPercent: 22,
              z: 690,
              rotation: -6,
              rotationX: -5,
              rotationY: 10,
              scale: 2.72,
            },
          ][index % 4];

          gsap.set(figure, {
            xPercent: 0,
            yPercent: 0,
            z: 0,
            rotation: 0,
            rotationX: 0,
            rotationY: 0,
            transformOrigin: "50% 50%",
            transformPerspective: 1000,
            willChange: "transform, opacity",
            force3D: true,
          });

          timeline.to(
            figure,
            {
              autoAlpha: 0,
              xPercent: flyPath.xPercent,
              yPercent: flyPath.yPercent,
              z: flyPath.z,
              scaleX: flyPath.scale,
              scaleY: flyPath.scale,
              rotation: flyPath.rotation,
              rotationX: flyPath.rotationX,
              rotationY: flyPath.rotationY,
              ease: "power3.in",
              duration: 0.5,
            },
            0.22 + index * 0.02,
          );

          if (cap) {
            timeline
              .fromTo(
                cap,
                { autoAlpha: 0, yPercent: 60 },
                {
                  autoAlpha: 1,
                  yPercent: 0,
                  ease: "power2.out",
                  duration: 0.2,
                },
                0.08,
              )
              .to(
                cap,
                {
                  autoAlpha: 0,
                  yPercent: -18,
                  ease: "power2.in",
                  duration: 0.14,
                },
                0.23 + index * 0.02,
              );
          }
        });

        timeline.fromTo(
          centerFigure,
          { scaleX: 1, scaleY: 1 },
          {
            scaleX: centerTargetScale,
            scaleY: centerTargetScale,
            ease: "none",
            duration: 0.72,
          },
          0.18,
        );

        var centerCap = centerFigure.querySelector(SELECTOR.zoomCaption);
        if (centerCap) {
          timeline
            .fromTo(
              centerCap,
              { autoAlpha: 0, yPercent: 50 },
              { autoAlpha: 1, yPercent: 0, ease: "power2.out", duration: 0.18 },
              0.1,
            )
            .to(
              centerCap,
              { autoAlpha: 0, ease: "power2.inOut", duration: 0.18 },
              0.48,
            );
        }

        if (overlay) {
          timeline.set(overlay, { pointerEvents: "auto" }, 0.72).to(
            overlay,
            {
              autoAlpha: 1,
              y: 0,
              scaleX: 1,
              scaleY: 1,
              duration: 0.28,
              ease: "power3.out",
            },
            0.72,
          );
        }

        if (overlayItems.length) {
          timeline.to(
            overlayItems,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.28,
              stagger: 0.045,
              ease: "power3.out",
            },
            0.78,
          );
        }

        return function () {
          if (title)
            gsap.set(title, { clearProps: "transform,opacity,willChange" });
          if (overlay) gsap.set(overlay, { clearProps: "all" });
          if (overlayItems.length)
            gsap.set(overlayItems, { clearProps: "all" });
          figures.forEach(function (figure) {
            gsap.set(figure, {
              clearProps: "transform,opacity,visibility,zIndex,willChange",
            });
            var cap = figure.querySelector(SELECTOR.zoomCaption);
            if (cap) gsap.set(cap, { clearProps: "all" });
          });
        };
      },
    );

    // Mobile: sticky-stacking deck. Each still recedes (scaleX/scaleY + fade) as the
    // next scrolls over it; captions fade in per photo.
    matchMedia.add(
      "(max-width: 63.999rem) and (prefers-reduced-motion: no-preference)",
      function () {
        var tweens = [];

        gsap.set(figures, {
          autoAlpha: 1,
          zIndex: function (index) {
            return index + 1;
          },
        });

        figures.forEach(function (figure, index) {
          var cap = figure.querySelector(SELECTOR.zoomCaption);
          if (cap) {
            tweens.push(
              gsap.fromTo(
                cap,
                { autoAlpha: 0, yPercent: 30 },
                {
                  autoAlpha: 1,
                  yPercent: 0,
                  ease: "power2.out",
                  scrollTrigger: {
                    trigger: figure,
                    start: "top 72%",
                    toggleActions: "play none none reverse",
                  },
                },
              ),
            );
          }

          if (index === figures.length - 1) return;

          var tween = gsap.to(figure, {
            scaleX: 0.92,
            scaleY: 0.92,
            autoAlpha: 0,
            ease: "none",
            overwrite: "auto",
            scrollTrigger: {
              trigger: figures[index + 1],
              start: "top bottom",
              end: "top top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          });

          tweens.push(tween);
        });

        return function () {
          tweens.forEach(function (tween) {
            if (tween.scrollTrigger) tween.scrollTrigger.kill();
            tween.kill();
          });

          figures.forEach(function (figure) {
            gsap.set(figure, {
              clearProps: "scaleX,scaleY,opacity,visibility,zIndex",
            });
            var cap = figure.querySelector(SELECTOR.zoomCaption);
            if (cap) gsap.set(cap, { clearProps: "all" });
          });
        };
      },
    );

    state.cleanups.push(function () {
      matchMedia.revert();
    });
  }

  function initReveals() {
    var gsap = state.gsap;
    var ScrollTrigger = state.ScrollTrigger;
    var reduced = state.reduced;
    var elements = queryAll(SELECTOR.reveal);

    if (!elements.length) return;

    if (reduced || !ScrollTrigger) {
      gsap.set(elements, { opacity: 1, y: 0 });
      return;
    }

    elements.forEach(function (element) {
      var fade = (element.getAttribute("data-reveal") || "").trim() === "fade";
      var delay = 0;
      var group = element.closest("[data-reveal-stagger]");

      if (group) {
        var siblings = queryAll(SELECTOR.reveal, group);
        delay = Math.max(0, siblings.indexOf(element)) * 0.09;
      }

      gsap.set(element, {
        opacity: 0,
        y: fade ? 0 : 34,
        force3D: true,
      });

      function assemble() {
        gsap.to(element, {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: "back.out(1.3)",
          delay: delay,
          overwrite: "auto",
        });
      }

      function strike(down) {
        gsap.to(element, {
          opacity: 0,
          y: fade ? 0 : down ? -12 : 12,
          duration: 0.4,
          ease: "power2.in",
          overwrite: "auto",
        });
      }

      ScrollTrigger.create({
        trigger: element,
        start: "top 86%",
        end: "bottom 12%",
        onEnter: assemble,
        onEnterBack: assemble,
        onLeave: function () {
          strike(true);
        },
        onLeaveBack: function () {
          strike(false);
        },
      });
    });
  }

  function refreshAfterLayoutSettles() {
    var timer;
    function refresh() {
      if (state.CLT && typeof state.CLT.refresh === "function") { state.CLT.refresh(); return; }
      win.clearTimeout(timer);
      timer = win.setTimeout(function () { if (state.ScrollTrigger) state.ScrollTrigger.refresh(); }, 200);
    }
    listen(win, "load", refresh, { once: true });
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(refresh).catch(function () {});
    refresh();
    state.cleanups.push(function () { win.clearTimeout(timer); });
  }

  function init(CLT) {
    state.CLT = CLT || win.CLT || {};

    state.gsap = win.gsap;
    if (!state.gsap) {
      win.console.warn("[clt-homepage.js] GSAP was not found.");
      return;
    }

    state.ScrollTrigger = getGSAPGlobal("ScrollTrigger");

    if (!state.ScrollTrigger) {
      win.console.warn("[clt-homepage.js] ScrollTrigger unavailable; scroll scenes skipped, carousels remain interactive.");
    }

    activateAvailablePlugins();

    var gsap = state.gsap;
    var ScrollTrigger = state.ScrollTrigger;
    var isMobileLike = win.matchMedia(
      "(max-width: 760px), (pointer: coarse)",
    ).matches;

    // Computed once and shared via state; each init* module reads state.reduced
    // instead of re-running matchMedia.
    state.reduced = win.matchMedia("(prefers-reduced-motion: reduce)").matches;

    state.mainContext = gsap.context(function (self) {
      state.contextIgnore =
        self && typeof self.ignore === "function"
          ? self.ignore.bind(self)
          : null;

      var modules = [
        { name: "Hero scrub", init: initHeroScrub },
        { name: "Acclaim marquee", init: initAcclaimMarquee },
        { name: "Explore carousel", init: initExploreCarousel },
        { name: "Poster archive", init: initPosterArchive },
        { name: "Zoom gallery", init: initZoomGallery },
        // Standard [data-reveal] animations are owned by clt-core.js.
        // Keeping them out of the page script avoids duplicate ScrollTriggers/tweens.
        { name: "Layout refresh", init: refreshAfterLayoutSettles },
      ];

      modules.forEach(function (module) {
        try {
          module.init();
        } catch (error) {
          win.console.warn(
            "[clt-homepage.js] " + module.name + " module failed.",
            error,
          );
        }
      });
    });

    listen(
      win,
      "pagehide",
      function (event) {
        if (event.persisted) return; // Keep handlers intact for Safari back/forward cache.
        state.cleanups.forEach(function (cleanup) {
          cleanup();
        });

        if (state.mainContext) {
          state.mainContext.revert();
        }

        state.contextIgnore = null;
      },
      false,
    );
    listen(win, "pageshow", function (event) {
      if (event.persisted && state.CLT && state.CLT.refresh) state.CLT.refresh();
    });
  }

  function start() {
    var attempts = 0;
    var maxAttempts = 90;

    function tryStart() {
      if (win.gsap) {
        if (win.CLT && typeof win.CLT.ready === "function") {
          win.CLT.ready(init);
          return;
        }

        init(win.CLT || {});
        return;
      }

      attempts += 1;

      if (attempts < maxAttempts) {
        win.setTimeout(tryStart, 50);
        return;
      }

      win.console.warn(
        "[clt-homepage.js] GSAP was not available before timeout.",
      );
    }

    tryStart();
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
