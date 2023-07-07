export const euroMask = (scale: number) => {
  return {
    mask: "num",
    lazy: false,
    blocks: {
      num: {
        mask: Number,
        signed: false,
        scale,
        padFractionalZeros: true,
        normalizeZeros: true,
        radix: ".",
        mapToRadix: [","],
      },
    },
  };
};

export const flatNumberMask = {
  mask: "num",
  lazy: false,
  blocks: {
    num: {
      mask: Number,
      signed: false,
      scale: 0,
      padFractionalZeros: false,
      normalizeZeros: false,
    },
  },
};
