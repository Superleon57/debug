import React, { useEffect } from "react";
import {
  Card,
  Link,
  CardMedia,
  Typography,
  Grid,
  Box,
  Button,
  CardContent,
  CardHeader,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { useSelector, useDispatch } from "store";
import {
  fetchCategories,
  getCategories,
  getShopCategories,
} from "store/api/categories";
import { Category } from "utils/types/Category";

import classes from "./Categories.module.scss";

const CategoryCard = ({ category }: { category: Category }) => {
  return (
    <Card className={classes.categoryCard}>
      <Link href={`/categories/${category.id}`} className={classes.link}>
        <CardMedia
          sx={{ height: 140 }}
          image={category.image}
          title={category.name}
        >
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            color="white"
            sx={{ textShadow: "#000 1px 0 10px", p: 2 }}
          >
            {category.name}
          </Typography>
        </CardMedia>
      </Link>
    </Card>
  );
};

const CategoriesCards = ({
  title,
  categories,
}: {
  title: string;
  categories: Category[];
}) => {
  return (
    <Card sx={{ borderRadius: "10px", m: 2 }} elevation={3}>
      <CardHeader title={title} />
      <Divider />
      <CardContent>
        <Grid container spacing={2}>
          {categories.map((category) => (
            <Grid key={category.id} item xs={6} md={4} lg={3}>
              <CategoryCard category={category} />
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

const Categories = () => {
  const dispatch = useDispatch();
  const categories = useSelector(getCategories);
  const shopCategories = useSelector(getShopCategories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, []);

  return (
    <Box>
      <Typography gutterBottom variant="body1" component="div" sx={{ mb: 2 }}>
        Créez des catégories pour vos produits pour les regrouper au même
        endroit.
      </Typography>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        className={classes.createButton}
      >
        <Link href="/categories/create" className={classes.createButtonLink}>
          Créer une catégorie
        </Link>
      </Button>

      <CategoriesCards title="Catégories de base" categories={categories} />

      <CategoriesCards
        title="Catégories de la boutique"
        categories={shopCategories}
      />
    </Box>
  );
};

Categories.title = "Catégories";

export default Categories;
