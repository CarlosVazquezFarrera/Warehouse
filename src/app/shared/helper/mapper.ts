import { PagedResult } from "../../models/custom/pagedResult";
import { SelectableProduct } from "../../models/custom/selectableProduct";
import { BaseDto } from "../../models/Dto/baseDto";
import { ProductDto } from "../../models/Dto/productDto";

export function mapPagedProductToSelectableProduct(pagedResult: PagedResult<ProductDto>, selectedId: Set<string>): PagedResult<SelectableProduct> {
  return {
    ...pagedResult,
    data: pagedResult.data.map((product) => mapProductToSelectable(product, selectedId)),
  };
}

export function mapPagedAfterUpdate<TDto extends BaseDto>(pagedDtos: PagedResult<TDto>, updatedDto: TDto) {
  const data = pagedDtos.data.map(d => {
    if (d.id == updatedDto.id) {
      return { ...updatedDto };
    }
    return d;
  });
  return {
    ...pagedDtos,
    data
  };
}

/**
 * Convierte un ProductDto a SelectableProduct
 * @param product ProductDto a convertir
 * @returns SelectableProduct con isSelected en false
 */
function mapProductToSelectable(product: ProductDto, selectedId: Set<string>): SelectableProduct {
  return {
    ...product,
    isSelected: selectedId.has(product.id)
  };
}

