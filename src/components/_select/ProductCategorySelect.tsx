import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import { Theme } from "@material-ui/core/styles/index";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import React, { useEffect, useState } from "react";
import Skeleton from "@material-ui/lab/Skeleton";
import { useTranslation } from "react-i18next";
import { makeStyles, useTheme } from "@material-ui/styles";
import { useProductCategoryQuery } from "../../graphql/query/ProductCategoryQuery";
import { PropTypes, useMediaQuery } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import { IProductCategoryFragmentProductCategorySelect } from "../../graphql/fragment/interface/ProductCategoryFragmentInterface";
import { productCategoryFragments } from "../../graphql/fragment/query/ProductCategoryFragment";

interface IProps {
  onChange: (value: unknown) => void;
  disabled?: boolean;
  value: string;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  margin?: PropTypes.Margin;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  listItem: {
    // paddingBottom: '8px',
  },
  img: {
    width: '100%'
  },
  titleBar: {
    background:
      'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
      'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)'
  },
  icon: {
    color: 'white'
  },
  radioLabel: {
    marginLeft: 0
  }
}));

export default function ProductCategorySelect(props: IProps) {
  const classes = useStyles();
  const { t } = useTranslation();
  const theme: Theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>('');
  const [tempValue, setTempValue] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [parentCategory, setParentCategory] = useState<any>(null);
  const [subCategory, setSubCategory] = useState<any>(null);

  const { onChange, disabled, margin, fullWidth, error, helperText } = props;

  const { loading, data } = useProductCategoryQuery<
    IProductCategoryFragmentProductCategorySelect
  >(productCategoryFragments.ProductCategorySelect, {
    variables: { parent_category_id_is_null: true, sort_title: 'asc' }
  });

  let productCategories: IProductCategoryFragmentProductCategorySelect[] = [];

  useEffect(() => {
    syncSelectedCategory(value);
  }, [value && !selectedCategory, data]);

  useEffect(() => {
    setValue(props.value);
    setTempValue(props.value);
    syncSelectedCategory(props.value);
  }, [props.value !== value]);

  function syncSelectedCategory(id: any) {
    productCategories.forEach((parentCategory: any) => {
      parentCategory.child_category.forEach((subCategory: any) => {
        subCategory.child_category.forEach((category: any) => {
          if (category.id === id) {
            setSelectedCategory(category);
            setSubCategory(subCategory);
            setParentCategory(parentCategory);
          }
        });
      });
    });
  }

  function handleOpen() {
    setOpen(true);
    if (!selectedCategory) {
      setValue('');
      setParentCategory(null);
      setSubCategory(null);
    }
  }

  function handleClose() {
    setOpen(false);
    setTempValue(value);
  }

  function handleOk() {
    onChange(tempValue);
    handleClose();
  }

  if (loading) {
    return (
      <FormControl fullWidth margin={margin}>
        <Skeleton variant={'rect'} height={48} />
      </FormControl>
    );
  }

  if (data) {
    productCategories = data.productCategory.items;
  }
  return (
    <FormControl fullWidth={fullWidth} error={error}>
      <List disablePadding>
        <ListItem
          disabled={disabled}
          button
          divider
          className={classes.listItem}
          aria-haspopup="true"
          aria-controls="product category"
          aria-label="product category"
          onClick={handleOpen}
        >
          <ListItemText
            primary={
              selectedCategory
                ? t('global$$productCategory::' + selectedCategory.title)
                : t('global$$product category')
            }
          />
        </ListItem>
      </List>
      <Dialog
        fullScreen={isMobile}
        disableBackdropClick
        disableEscapeKeyDown
        fullWidth
        maxWidth="xs"
        open={open}
      >
        <DialogTitle>{t('global$$product category')}</DialogTitle>
        <DialogContent>
          <List className={classes.root}>
            {!parentCategory && (
              <React.Fragment>
                {productCategories.map(productCategory => (
                  <ListItem
                    key={productCategory.id}
                    button
                    onClick={() => {
                      setParentCategory(productCategory);
                    }}
                  >
                    <ListItemText
                      primary={t(
                        'global$$productCategory::' + productCategory.title
                      )}
                    />
                    <ListItemIcon>
                      <ChevronRightIcon />
                    </ListItemIcon>
                  </ListItem>
                ))}
              </React.Fragment>
            )}
            {parentCategory && !subCategory && (
              <React.Fragment>
                <Button
                  color="primary"
                  onClick={() => {
                    setParentCategory(null);
                  }}
                >
                  <ChevronLeftIcon />
                  {t('global$$back')}
                </Button>
                {parentCategory.child_category.map((productCategory: any) => (
                  <ListItem
                    key={productCategory.id}
                    button
                    onClick={() => {
                      setSubCategory(productCategory);
                    }}
                  >
                    <ListItemText
                      primary={t(
                        'global$$productCategory::' + productCategory.title
                      )}
                    />
                    <ListItemIcon>
                      <ChevronRightIcon />
                    </ListItemIcon>
                  </ListItem>
                ))}
              </React.Fragment>
            )}

            {parentCategory && subCategory && (
              <React.Fragment>
                <Button
                  color="primary"
                  onClick={() => {
                    setSubCategory(null);
                  }}
                >
                  <ChevronLeftIcon />
                  {t('global$$back')}
                </Button>
                <RadioGroup
                  aria-label="Ringtone"
                  name="ringtone"
                  value={tempValue}
                  onChange={(e, value) => {
                    setTempValue(value);
                  }}
                >
                  {subCategory.child_category.map((productCategory: any) => (
                    <FormControlLabel
                      value={productCategory.id}
                      key={productCategory.id}
                      control={<Radio color="primary" />}
                      className={classes.radioLabel}
                      label={t(
                        'global$$productCategory::' + productCategory.title
                      )}
                    />
                  ))}
                </RadioGroup>
              </React.Fragment>
            )}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {t('cancel')}
          </Button>
          <Button onClick={handleOk} color="primary">
            {t('ok')}
          </Button>
        </DialogActions>
      </Dialog>
      {helperText && (
        <FormHelperText error={error}>{helperText}</FormHelperText>
      )}
    </FormControl>
  );
}
