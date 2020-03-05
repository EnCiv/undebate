'use strict;';

import { auto_quality, placeholder_image } from '../cloudinary-urls';

global.logger = { error: jest.fn() };

const BASE_URL = `https://res.cloudinary.com/hf6mryjpf/video/upload`;
const WEBM_PATH = `v1581063510/5e3d18093ebd3a0017d9621b-0-speaking20200207T081823130Z.webm`;

describe('cloudinary url utils', () => {
  it('should transform base webm path to mp4 & png', () => {
    const initial_url = `${BASE_URL}/${WEBM_PATH}`;

    const returned_mp4_url = auto_quality(initial_url);
    const returned_png_url = placeholder_image(initial_url);

    expect(returned_mp4_url).toEqual(
      `${BASE_URL}/q_auto/v1581063510/5e3d18093ebd3a0017d9621b-0-speaking20200207T081823130Z.mp4`
    );
    expect(returned_png_url).toEqual(
      `${BASE_URL}/so_0/v1581063510/5e3d18093ebd3a0017d9621b-0-speaking20200207T081823130Z.png`
    );
  });

  it('should transform formatted webm path to mp4 & png', () => {
    const initial_url = `${BASE_URL}/w_300,h_200,c_crop/${WEBM_PATH}`;

    const returned_mp4_url = auto_quality(initial_url);
    const returned_png_url = placeholder_image(initial_url);

    expect(returned_mp4_url).toEqual(
      `${BASE_URL}/w_300,h_200,c_crop,q_auto/v1581063510/5e3d18093ebd3a0017d9621b-0-speaking20200207T081823130Z.mp4`
    );
    expect(returned_png_url).toEqual(
      `${BASE_URL}/w_300,h_200,c_crop,so_0/v1581063510/5e3d18093ebd3a0017d9621b-0-speaking20200207T081823130Z.png`
    );
  });

  it('should raise an error on invalid webpm path', () => {
    const initial_url = `${BASE_URL}/w_300,h_200,c_crop/extra/parts/dont/work/${WEBM_PATH}`;

    const returned_mp4_url = auto_quality(initial_url);
    const returned_png_url = placeholder_image(initial_url);

    expect(returned_mp4_url).toEqual(
      `${BASE_URL}/w_300,h_200,c_crop/extra/parts/dont/work/v1581063510/5e3d18093ebd3a0017d9621b-0-speaking20200207T081823130Z.mp4`
    );
    expect(returned_png_url).toEqual(
      `${BASE_URL}/w_300,h_200,c_crop/extra/parts/dont/work/v1581063510/5e3d18093ebd3a0017d9621b-0-speaking20200207T081823130Z.png`
    );
    expect(logger.error).toHaveBeenCalledTimes(2);
  });
});
