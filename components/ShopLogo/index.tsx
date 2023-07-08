import React, { useEffect, useState } from "react";
import ImageUploading, {
  ImageListType,
  ImageType,
} from "react-images-uploading";
import { Box, LinearProgress, styled, Button, Avatar } from "@mui/material";

import { useUploadForm } from "utils/api";
import { useDispatch, useSelector } from "store";
import { getShop, updateShopLogo } from "store/reducers/shopSlice";
import { shopLogoAvatar } from "utils/avatar";

import classes from "./ShopLogo.module.scss";

const Image = styled("img")(({ isLoading }: { isLoading: boolean }) => ({
  borderRadius: "50%",
  height: "150px",
  width: "150px",
  opacity: isLoading ? 0.5 : 1,
  objectFit: "cover",
  objectPosition: "center",
  transition: "all 0.3s ease",
  "&:hover": {
    opacity: 0.8,
  },
  border: "1px solid #ccc",
}));

const ShopLogo = () => {
  const [images, setImages] = useState<ImageListType>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const shop = useSelector(getShop);

  useEffect(() => {
    setImages([{ dataURL: shop?.logo }]);
  }, [shop]);

  const { uploadForm, progress } = useUploadForm(
    "/protected/admin/upload/logo"
  );

  const uploadImage = async (image: ImageType) => {
    if (!image.file) return image;

    const formdata = new FormData();

    formdata.append("image", image.file);
    formdata.append("shopId", shop.id);

    setIsLoading(true);
    const response = await uploadForm(formdata);
    setIsLoading(false);

    const imageUrl = response.data?.payload?.url;

    dispatch(updateShopLogo(imageUrl));
  };

  const onChange = (imageList: ImageListType) => {
    setImages(imageList);
    uploadImage(imageList[0]);
  };

  return (
    <ImageUploading
      value={images}
      onChange={onChange}
      maxNumber={1}
      acceptType={["jpg"]}
    >
      {({ imageList, onImageUpdate }) => {
        const image = imageList[0];
        return (
          <Box height={200} display="flex" alignItems="center">
            {image?.dataURL ? (
              <Image isLoading={isLoading} src={image?.dataURL} alt="" />
            ) : (
              <Avatar className={classes.image} {...shopLogoAvatar(shop)} />
            )}

            <Button
              color="secondary"
              variant="contained"
              onClick={() => onImageUpdate(0)}
              sx={{ ml: 3 }}
            >
              Changer de logo
            </Button>
            {isLoading && (
              <LinearProgress
                variant="determinate"
                value={progress}
                color="secondary"
                sx={{ height: "8px" }}
              />
            )}
          </Box>
        );
      }}
    </ImageUploading>
  );
};

export default ShopLogo;
