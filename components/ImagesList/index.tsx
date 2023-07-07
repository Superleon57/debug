import React, { useEffect, useState } from "react";
import ImageUploading from "react-images-uploading";
import { useFormContext } from "react-hook-form";
import { Box, Grid, IconButton } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import UploadIcon from "@mui/icons-material/Upload";

import { client } from "utils/api";

import classes from "./ImagesList.module.css";

import type { ImageListType } from "react-images-uploading";

const Image = ({
  imageUrl,
  index,
  remove,
}: {
  imageUrl: string;
  index: number;
  remove: (index: number) => void;
}) => {
  return (
    <Grid item className={classes.Item}>
      <img src={imageUrl} alt="" className={classes.productImage} />
      <IconButton
        onClick={() => remove(index)}
        className={classes.DeleteButton}
      >
        <DeleteForeverIcon color="error" />
      </IconButton>
    </Grid>
  );
};

const addProductImage = async (image: File) => {
  const formdata = new FormData();

  formdata.append("image", image);

  const response = await client.post("/protected/admin/upload/add", formdata);
  return response.data?.payload?.url;
};

const ImagesList = ({
  existingImages = [],
}: {
  existingImages: ImageListType | string[];
}) => {
  const { register, watch, setValue } = useFormContext();
  const [images, setImages] = useState(watch("imagesURL") || existingImages);

  const maxNumber = 6;

  useEffect(() => {
    register("imagesURL", { value: existingImages });
  }, [existingImages]);

  const uploadImages = async (imageList: ImageListType) => {
    const newImages = await Promise.all(
      imageList.map((image) => {
        if (!image.file) return image;
        const imageUrl = addProductImage(image.file);
        return imageUrl;
      })
    );

    return newImages;
  };

  const removeImage = (index: number) => {
    const newImages = [...watch("imagesURL")];
    newImages.splice(index, 1);
    // register('imagesURL', { value: newImages });
    setValue("imagesURL", newImages);
    setImages(newImages);
  };

  const onChange = async (imageList: ImageListType) => {
    const newImages = await uploadImages(imageList);
    setImages(newImages);
    // register('imagesURL', { value: newImages });
    setValue("imagesURL", newImages);
  };

  return (
    <Box>
      <ImageUploading
        value={images}
        multiple
        onChange={onChange}
        maxNumber={maxNumber}
        dataURLKey="data_url"
        acceptType={["jpg"]}
      >
        {({ imageList, onImageUpload, dragProps }) => (
          <Grid container spacing={2}>
            {imageList &&
              imageList.map((image, index) => (
                <Image
                  key={index}
                  imageUrl={image.data_url ? image.data_url : image}
                  remove={removeImage}
                  index={index}
                />
              ))}
            {imageList === undefined ||
              (imageList?.length < maxNumber && (
                <Grid item className={classes.Item}>
                  <Box className={classes.AddImagePlaceholder}>
                    <IconButton onClick={onImageUpload} {...dragProps}>
                      <UploadIcon color="primary" />
                    </IconButton>
                  </Box>
                </Grid>
              ))}
          </Grid>
        )}
      </ImageUploading>
    </Box>
  );
};

export default ImagesList;
