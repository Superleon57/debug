import React, { useEffect, useState } from "react";
import ImageUploading from "react-images-uploading";
import { useFormContext } from "react-hook-form";
import { Box, IconButton, InputLabel } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import UploadIcon from "@mui/icons-material/Upload";

import ErrorMessage from "components/ErrorMessage";

import classes from "./UploadImage.module.scss";

import type { ImageListType } from "react-images-uploading";

const Image = ({
  imageUrl,
  remove,
  canEdit,
}: {
  imageUrl: string;
  remove: () => void;
  canEdit?: boolean;
}) => {
  const [isHover, setIsHover] = useState(false);

  const handleMouseEnter = () => setIsHover(true);
  const handleMouseLeave = () => setIsHover(false);

  return (
    <Box
      className={classes.ImageContainer}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <Box
          className={classes.hoverBox}
          sx={{
            opacity: isHover && canEdit ? 1 : 0,
          }}
        >
          <IconButton className={classes.DeleteButton} onClick={remove}>
            <DeleteForeverIcon />
          </IconButton>
        </Box>
        <img src={imageUrl} alt="" className={classes.categoryImage} />
      </Box>
    </Box>
  );
};

type UploadBoxProps = {
  dragProps: any;
  isDragging: boolean;
  onImageUpload: () => void;
};

const UploadBox = ({
  dragProps,
  isDragging,
  onImageUpload,
}: UploadBoxProps) => {
  const boxStyle = {
    background: isDragging ? "#b4c9cc" : "#c8dadf",
    outlineOffset: isDragging ? "0px" : "-10px",
  };
  return (
    <Box className={classes.UploadBox} sx={boxStyle} {...dragProps}>
      <UploadIcon className={classes.UploadIcon} />

      <InputLabel sx={{ color: "#92b0b3", fontSize: "1rem" }}>
        <strong onClick={onImageUpload} className={classes.selectImageText}>
          Selectionnez
        </strong>{" "}
        ou glissez-déposez votre image ici
      </InputLabel>
    </Box>
  );
};

const UploadImage = ({
  existingImage,
  title,
  canEdit = true,
}: {
  existingImage?: string;
  title: string;
  canEdit?: boolean;
}) => {
  const {
    setValue,
    formState: { errors },
    trigger,
    register,
  } = useFormContext();

  const [images, setImages] = useState([] as ImageListType);
  register("image", { value: existingImage });

  useEffect(() => {
    if (existingImage) {
      setImages([{ data_url: existingImage }]);
    }
  }, [existingImage]);

  const removeImage = () => {
    setImages([]);
    setValue("image", null, { shouldDirty: true });
    trigger("image");
  };

  const onChange = async (imageList: ImageListType) => {
    if (imageList.length === 0) {
      removeImage();
      return;
    }

    setImages(imageList);
    setValue("image", imageList[0]?.file, { shouldDirty: true });
    trigger("image");
  };

  return (
    <Box>
      <ImageUploading
        value={images}
        onChange={onChange}
        maxNumber={1}
        dataURLKey="data_url"
        acceptType={["jpg", "png", "jpeg"]}
      >
        {({ imageList, onImageUpload, dragProps, isDragging }) => {
          return (
            <Box>
              <InputLabel className={classes.inputLabel}>{title}</InputLabel>

              {imageList?.length === 0 && (
                <UploadBox {...{ dragProps, isDragging, onImageUpload }} />
              )}

              {imageList?.map((image, index) => (
                <Image
                  key={index}
                  imageUrl={image?.data_url}
                  remove={removeImage}
                  canEdit={canEdit}
                />
              ))}
            </Box>
          );
        }}
      </ImageUploading>
      <ErrorMessage errors={errors} field="image" />
    </Box>
  );
};

export default UploadImage;
