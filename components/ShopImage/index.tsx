import React, { useEffect, useState } from "react";
import ImageUploading, {
  ImageListType,
  ImageType,
} from "react-images-uploading";
import { Box, LinearProgress, styled } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

import { useUploadForm } from "utils/api";
import { useDispatch, useSelector } from "store";
import { getShop, updateShopImage } from "store/reducers/shopSlice";

import classes from "./ShopImage.module.scss";

const ShopImg = styled("img")(({ isLoading }: { isLoading: boolean }) => ({
  display: "block",
  borderRadius: "5px 5px 0 0",
  height: "100%",
  width: "100%",
  objectFit: "cover",
  opacity: isLoading ? 0.5 : 1,
}));

const NoImageIcon = styled(AddPhotoAlternateIcon)({
  fontSize: "100px",
  color: "#ccc",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
});

const ShopImage = ({ currentImage }: { currentImage: string }) => {
  const [images, setImages] = useState<ImageListType>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const shop = useSelector(getShop);

  useEffect(() => {
    setImages([{ dataURL: currentImage }]);
  }, [currentImage]);

  const { uploadForm, progress } = useUploadForm(
    "/protected/admin/upload/image"
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

    dispatch(updateShopImage(imageUrl));
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
          <Box height={200} sx={{ position: "relative" }}>
            <ShopImg isLoading={isLoading} src={image?.dataURL} alt="" />
            {!image?.dataURL && <NoImageIcon />}
            <div className={classes.pictureEdit}>
              <EditIcon color="secondary" onClick={() => onImageUpdate(0)} />
            </div>
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

export default ShopImage;
