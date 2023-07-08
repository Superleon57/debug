import React from "react";
import { List, ListItem, Checkbox, ListItemText } from "@mui/material";
import { useFormContext } from "react-hook-form";

import { Category } from "utils/types/Category";

const sortAlphabetically = (a: Category, b: Category) => {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }

  return 0;
};

const Categories = ({
  categories,
  field,
}: {
  categories: Category[];
  field: string;
}) => {
  const { setValue, watch } = useFormContext();
  const selectedCategories = watch(field) || [];

  const sortSelectedFirst = (acc: Category[], category: Category) => {
    if (selectedCategories.includes(category.id)) {
      acc.unshift(category);
    } else {
      acc.push(category);
    }
    return acc;
  };

  const handleCheckboxChange = (categoryId: string) => {
    const isChecked = selectedCategories?.includes(categoryId);
    const updatedCategories = isChecked
      ? selectedCategories?.filter((id: string) => id !== categoryId)
      : [...selectedCategories, categoryId];

    setValue(field, updatedCategories);
  };

  const sortedCategories = categories
    .sort(sortAlphabetically)
    .reduce(sortSelectedFirst, []);

  return (
    <List
      sx={{
        width: "100%",
        bgcolor: "background.paper",
        height: 200,
        overflow: "auto",
      }}
    >
      {sortedCategories.map((category) => {
        const labelId = `checkbox-list-label-${category.id}`;
        return (
          <ListItem key={category.id} disablePadding>
            <Checkbox
              checked={selectedCategories?.includes(category.id)}
              onChange={() => handleCheckboxChange(category.id)}
              name={`${field}.${category.id}`}
              value={category.id}
            />
            <ListItemText id={labelId} primary={category.name} />
          </ListItem>
        );
      })}
    </List>
  );
};

export default Categories;
