import {Component, Input, OnInit} from '@angular/core';
import {Product} from "../../../shared/model/product.entity";
import {ProductsService} from "../../../admin-products/services/products.service";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {RouterLink} from "@angular/router";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatCardModule} from "@angular/material/card";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {CurrencyPipe, NgClass} from "@angular/common";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {UsersService} from "../../../admin-products/services/users.service";

@Component({
  selector: 'app-comparator',
  standalone: true,
  imports: [MatButton, MatInputModule,
    MatCardModule, MatPaginatorModule, MatSortModule, MatFormFieldModule,
    MatIconModule, MatTableModule, NgClass, CurrencyPipe, MatOption, MatSelect, RouterLink, MatIconButton],
  templateUrl: './comparator.component.html',
  styleUrl: './comparator.component.css'
})
export class ComparatorComponent implements OnInit{
  @Input() product: any;
  dataSource!:MatTableDataSource<any>;
  displayedColumns: string[] = ['name', 'price', 'seller','actions'];  // Columnas para la tabla

  constructor(private productService:ProductsService, private userService:UsersService) {
    this.product = {};
    this.dataSource = new MatTableDataSource<any>();

  }

  private getAllProducts() {
    this.productService.getAll().subscribe((productsResponse: any) => {
      const filteredProducts = productsResponse.filter((p: any) => this.isSimilar(p));

      const sortedProducts = filteredProducts.sort((a: any, b: any) => a.price - b.price);

      const topProducts = sortedProducts.slice(0, 3);

      this.enrichWithSellerNames(topProducts);
    });
  }

  private isSimilar(p: any): boolean {
    return p.name.includes(this.product.name) || p.manufacturerNumber === this.product.manufacturerNumber;
  }

  private enrichWithSellerNames(products: any[]) {
    const entrepreneurIds = products.map(p => p.userId);

    this.userService.getAll().subscribe((usersResponse: any) => {
      const enrichedProducts = products.map(product => {
        console.log(usersResponse);
        const seller = usersResponse.find((user: any) => user.id == product.entrepreneurId);
        console.log(seller);
        return {
          id:product.id,
          name: product.name,
          price: product.price,
          sellerName: seller ? `${seller.username}` : 'Unknown Seller'
        };
      });
      this.dataSource.data = enrichedProducts;
    });
  }

  ngOnInit() {
    this.getAllProducts();
  }
}
