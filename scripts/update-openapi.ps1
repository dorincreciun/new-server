$content = @'
openapi: 3.0.3
info:
  title: Pizza Shop API
  version: 2.0.0
  description: >
    API for the pizza shop - JWT authentication in HTTP-only cookies, OpenAPI-first.

    Download Schema: [TypeScript Definitions (schema.d.ts)](/api/docs/schema.d.ts) | [OpenAPI Spec (openapi.yaml)](/api/docs/openapi.yaml)
servers:
  - url: http://localhost:3000/api
components:
  securitySchemes:
    cookieAuth:
      type: apiKey
      in: cookie
      name: access_token
  schemas:
    SuccessResponse:
      type: object
      required: [message, data]
      properties:
        message: { type: string, example: Operation successful }
        data: { type: object }
        meta: { type: object }
    ErrorResponse:
      type: object
      required: [message, code]
      properties:
        message: { type: string, example: Validation error }
        code: { type: string, example: VALIDATION_ERROR }
        details:
          type: array
          items:
            type: object
            properties:
              field: { type: string }
              message: { type: string }
    UserDTO:
      type: object
      required: [id, email]
      properties:
        id: { type: integer, example: 1 }
        email: { type: string, format: email, example: user@example.com }
        name: { type: string, example: John Doe }
    Category:
      type: object
      required: [id, name, slug]
      properties:
        id: { type: integer, example: 1 }
        slug: { type: string, example: classic-pizzas }
        name: { type: string, example: Classic Pizzas }
        description: { type: string, example: Traditional pizzas with classic Italian recipes }
    Ingredient:
      type: object
      required: [id, key, label]
      properties:
        id: { type: integer, example: 1 }
        key: { type: string, example: mozzarella }
        label: { type: string, example: Mozzarella }
    Flag:
      type: object
      required: [id, key, label]
      properties:
        id: { type: integer, example: 1 }
        key: { type: string, example: vegetarian }
        label: { type: string, example: Vegetarian }
    DoughType:
      type: object
      required: [id, key, label]
      properties:
        id: { type: integer, example: 1 }
        key: { type: string, example: classic }
        label: { type: string, example: Classic Dough }
    SizeOption:
      type: object
      required: [id, key, label]
      properties:
        id: { type: integer, example: 1 }
        key: { type: string, example: medium }
        label: { type: string, example: Medium (30cm) }
    Product:
      type: object
      required: [id, name, basePrice]
      properties:
        id: { type: integer, example: 1 }
        name: { type: string, example: Pizza Margherita }
        description: { type: string, example: Classic Italian pizza }
        basePrice: { type: number, format: double, example: 25.00 }
        minPrice: { type: number, format: double, example: 20.00 }
        maxPrice: { type: number, format: double, example: 35.00 }
        imageUrl: { type: string }
        popularity: { type: integer }
        ratingAverage: { type: number }
        ratingCount: { type: integer }
        isCustomizable: { type: boolean }
        category: { $ref: '#/components/schemas/Category' }
    ProductWithRelations:
      allOf:
        - $ref: '#/components/schemas/Product'
        - type: object
          properties:
            flags:
              type: array
              items: { $ref: '#/components/schemas/Flag' }
            ingredients:
              type: array
              items: { $ref: '#/components/schemas/Ingredient' }
            variants:
              type: array
              items:
                type: object
                required: [id, price, isDefault]
                properties:
                  id: { type: integer }
                  price: { type: number }
                  isDefault: { type: boolean }
                  doughType: { $ref: '#/components/schemas/DoughType' }
                  sizeOption: { $ref: '#/components/schemas/SizeOption' }
    PaginationMeta:
      type: object
      required: [page, limit, total, totalPages]
      properties:
        page: { type: integer, example: 1 }
        limit: { type: integer, example: 12 }
        total: { type: integer, example: 65 }
        totalPages: { type: integer, example: 6 }
    CartItem:
      type: object
      required: [id, quantity, lineTotal]
      properties:
        id: { type: integer, example: 501 }
        product: { $ref: '#/components/schemas/Product' }
        variant:
          type: object
          required: [id, price]
          properties:
            id: { type: integer }
            doughType: { $ref: '#/components/schemas/DoughType' }
            sizeOption: { $ref: '#/components/schemas/SizeOption' }
            price: { type: number }
        quantity: { type: integer, example: 2 }
        lineTotal: { type: number, example: 240 }
    Cart:
      type: object
      required: [id, items, total]
      properties:
        id: { type: integer, example: 1 }
        items:
          type: array
          items: { $ref: '#/components/schemas/CartItem' }
        subtotal: { type: number }
        discounts: { type: number }
        total: { type: number }
  responses:
    BadRequest:
      description: Bad request
      content:
        application/json:
          schema: { $ref: '#/components/schemas/ErrorResponse' }
    Unauthorized:
      description: Unauthorized
      content:
        application/json:
          schema: { $ref: '#/components/schemas/ErrorResponse' }
    Forbidden:
      description: Forbidden
      content:
        application/json:
          schema: { $ref: '#/components/schemas/ErrorResponse' }
    NotFound:
      description: Resource not found
      content:
        application/json:
          schema: { $ref: '#/components/schemas/ErrorResponse' }
    Conflict:
      description: Conflict
      content:
        application/json:
          schema: { $ref: '#/components/schemas/ErrorResponse' }
    ValidationError:
      description: Validation error
      content:
        application/json:
          schema: { $ref: '#/components/schemas/ErrorResponse' }
    InternalError:
      description: Internal server error
      content:
        application/json:
          schema: { $ref: '#/components/schemas/ErrorResponse' }
paths:
  /auth/register:
    post:
      tags: [Auth]
      summary: Register new user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [email, password]
              properties:
                email: { type: string, format: email }
                password: { type: string, minLength: 6 }
                name: { type: string }
      responses:
        '201':
          description: Created
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/SuccessResponse'
                  - type: object
                    properties:
                      data: { $ref: '#/components/schemas/UserDTO' }
        '400': { $ref: '#/components/responses/BadRequest' }
        '409': { $ref: '#/components/responses/Conflict' }
        '422': { $ref: '#/components/responses/ValidationError' }
        '500': { $ref: '#/components/responses/InternalError' }
  /auth/login:
    post:
      tags: [Auth]
      summary: User login
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [email, password]
              properties:
                email: { type: string, format: email }
                password: { type: string }
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/SuccessResponse'
                  - type: object
                    properties:
                      data: { $ref: '#/components/schemas/UserDTO' }
        '401': { $ref: '#/components/responses/Unauthorized' }
        '500': { $ref: '#/components/responses/InternalError' }
  /auth/refresh:
    post:
      tags: [Auth]
      summary: Refresh access token
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/SuccessResponse'
                  - type: object
                    properties:
                      data: { $ref: '#/components/schemas/UserDTO' }
        '401': { $ref: '#/components/responses/Unauthorized' }
        '500': { $ref: '#/components/responses/InternalError' }
  /auth/me:
    get:
      tags: [Auth]
      summary: Get current user
      security: [{ cookieAuth: [] }]
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/SuccessResponse'
                  - type: object
                    properties:
                      data: { $ref: '#/components/schemas/UserDTO' }
        '401': { $ref: '#/components/responses/Unauthorized' }
        '500': { $ref: '#/components/responses/InternalError' }
  /auth/logout:
    post:
      tags: [Auth]
      summary: User logout
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema: { $ref: '#/components/schemas/SuccessResponse' }
        '500': { $ref: '#/components/responses/InternalError' }
  /categories:
    get:
      tags: [Categories]
      summary: Category list
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/SuccessResponse'
                  - type: object
                    properties:
                      data:
                        type: array
                        items: { $ref: '#/components/schemas/Category' }
        '500': { $ref: '#/components/responses/InternalError' }
    post:
      tags: [Categories]
      summary: Create category (Admin)
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [name, slug]
              properties:
                name: { type: string }
                slug: { type: string }
                description: { type: string }
      responses:
        '201':
          description: Created
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/SuccessResponse'
                  - type: object
                    properties:
                      data: { $ref: '#/components/schemas/Category' }
        '401': { $ref: '#/components/responses/Unauthorized' }
        '403': { $ref: '#/components/responses/Forbidden' }
        '409': { $ref: '#/components/responses/Conflict' }
        '422': { $ref: '#/components/responses/ValidationError' }
        '500': { $ref: '#/components/responses/InternalError' }
  /categories/{slug}:
    get:
      tags: [Categories]
      summary: Category details
      parameters:
        - name: slug
          in: path
          required: true
          schema: { type: string }
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/SuccessResponse'
                  - type: object
                    properties:
                      data: { $ref: '#/components/schemas/Category' }
        '404': { $ref: '#/components/responses/NotFound' }
        '500': { $ref: '#/components/responses/InternalError' }
    patch:
      tags: [Categories]
      summary: Update category
      parameters:
        - name: slug
          in: path
          required: true
          schema: { type: string }
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                name: { type: string }
                description: { type: string }
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/SuccessResponse'
                  - type: object
                    properties:
                      data: { $ref: '#/components/schemas/Category' }
        '401': { $ref: '#/components/responses/Unauthorized' }
        '403': { $ref: '#/components/responses/Forbidden' }
        '404': { $ref: '#/components/responses/NotFound' }
        '422': { $ref: '#/components/responses/ValidationError' }
        '500': { $ref: '#/components/responses/InternalError' }
    delete:
      tags: [Categories]
      summary: Delete category
      parameters:
        - name: slug
          in: path
          required: true
          schema: { type: string }
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema: { $ref: '#/components/schemas/SuccessResponse' }
        '401': { $ref: '#/components/responses/Unauthorized' }
        '403': { $ref: '#/components/responses/Forbidden' }
        '404': { $ref: '#/components/responses/NotFound' }
        '500': { $ref: '#/components/responses/InternalError' }
  /products:
    get:
      tags: [Products]
      summary: Simple product list
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/SuccessResponse'
                  - type: object
                    properties:
                      data:
                        type: array
                        items: { $ref: '#/components/schemas/Product' }
        '500': { $ref: '#/components/responses/InternalError' }
    post:
      tags: [Products]
      summary: Create product (Admin)
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [name, categoryId, basePrice]
              properties:
                name: { type: string }
                categoryId: { type: integer }
                basePrice: { type: number }
                description: { type: string }
      responses:
        '201':
          description: Created
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/SuccessResponse'
                  - type: object
                    properties:
                      data: { $ref: '#/components/schemas/Product' }
        '401': { $ref: '#/components/responses/Unauthorized' }
        '403': { $ref: '#/components/responses/Forbidden' }
        '422': { $ref: '#/components/responses/ValidationError' }
        '500': { $ref: '#/components/responses/InternalError' }
  /products/{id}:
    get:
      tags: [Products]
      summary: Product details
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: integer }
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/SuccessResponse'
                  - type: object
                    properties:
                      data: { $ref: '#/components/schemas/ProductWithRelations' }
        '404': { $ref: '#/components/responses/NotFound' }
        '500': { $ref: '#/components/responses/InternalError' }
    patch:
      tags: [Products]
      summary: Update product
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: integer }
      requestBody:
        content:
          application/json:
            schema: { type: object }
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/SuccessResponse'
                  - type: object
                    properties:
                      data: { $ref: '#/components/schemas/Product' }
        '401': { $ref: '#/components/responses/Unauthorized' }
        '403': { $ref: '#/components/responses/Forbidden' }
        '404': { $ref: '#/components/responses/NotFound' }
        '422': { $ref: '#/components/responses/ValidationError' }
        '500': { $ref: '#/components/responses/InternalError' }
    delete:
      tags: [Products]
      summary: Delete product
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: integer }
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema: { $ref: '#/components/schemas/SuccessResponse' }
        '401': { $ref: '#/components/responses/Unauthorized' }
        '403': { $ref: '#/components/responses/Forbidden' }
        '404': { $ref: '#/components/responses/NotFound' }
        '500': { $ref: '#/components/responses/InternalError' }
  /browse/products:
    get:
      tags: [Browse]
      summary: Advanced product filtering
      parameters:
        - name: q
          in: query
          schema: { type: string }
        - name: categorySlug
          in: query
          schema: { type: string }
        - name: page
          in: query
          schema: { type: integer, default: 1 }
        - name: limit
          in: query
          schema: { type: integer, default: 12 }
        - name: sort
          in: query
          schema: { type: string, enum: [price, rating, popularity, newest] }
        - name: order
          in: query
          schema: { type: string, enum: [asc, desc] }
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/SuccessResponse'
                  - type: object
                    properties:
                      data:
                        type: array
                        items: { $ref: '#/components/schemas/ProductWithRelations' }
                      meta: { $ref: '#/components/schemas/PaginationMeta' }
        '500': { $ref: '#/components/responses/InternalError' }
  /browse/filters:
    get:
      tags: [Browse]
      summary: Get filter options
      parameters:
        - name: categorySlug
          in: query
          schema: { type: string }
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/SuccessResponse'
                  - type: object
                    properties:
                      data:
                        type: object
                        properties:
                          price:
                            type: object
                            properties:
                              min: { type: number }
                              max: { type: number }
                          categories:
                            type: array
                            items:
                              type: object
                              required: [id, slug, name, count]
                              properties:
                                id: { type: integer }
                                slug: { type: string }
                                name: { type: string }
                                count: { type: integer }
        '500': { $ref: '#/components/responses/InternalError' }
  /cart:
    get:
      tags: [Cart]
      summary: Get cart
      security: [{ cookieAuth: [] }]
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/SuccessResponse'
                  - type: object
                    properties:
                      data: { $ref: '#/components/schemas/Cart' }
        '401': { $ref: '#/components/responses/Unauthorized' }
        '500': { $ref: '#/components/responses/InternalError' }
    delete:
      tags: [Cart]
      summary: Clear cart
      security: [{ cookieAuth: [] }]
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema: { $ref: '#/components/schemas/SuccessResponse' }
        '401': { $ref: '#/components/responses/Unauthorized' }
        '500': { $ref: '#/components/responses/InternalError' }
  /cart/items:
    post:
      tags: [Cart]
      summary: Add to cart
      security: [{ cookieAuth: [] }]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [productVariantId]
              properties:
                productVariantId: { type: integer }
                quantity: { type: integer, default: 1 }
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/SuccessResponse'
                  - type: object
                    properties:
                      data: { $ref: '#/components/schemas/Cart' }
        '401': { $ref: '#/components/responses/Unauthorized' }
        '404': { $ref: '#/components/responses/NotFound' }
        '422': { $ref: '#/components/responses/ValidationError' }
        '500': { $ref: '#/components/responses/InternalError' }
  /cart/items/{itemId}:
    patch:
      tags: [Cart]
      summary: Update quantity
      security: [{ cookieAuth: [] }]
      parameters:
        - name: itemId
          in: path
          required: true
          schema: { type: integer }
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [quantity]
              properties:
                quantity: { type: integer }
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/SuccessResponse'
                  - type: object
                    properties:
                      data: { $ref: '#/components/schemas/Cart' }
        '401': { $ref: '#/components/responses/Unauthorized' }
        '404': { $ref: '#/components/responses/NotFound' }
        '422': { $ref: '#/components/responses/ValidationError' }
        '500': { $ref: '#/components/responses/InternalError' }
    delete:
      tags: [Cart]
      summary: Remove from cart
      security: [{ cookieAuth: [] }]
      parameters:
        - name: itemId
          in: path
          required: true
          schema: { type: integer }
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/SuccessResponse'
                  - type: object
                    properties:
                      data: { $ref: '#/components/schemas/Cart' }
        '401': { $ref: '#/components/responses/Unauthorized' }
        '404': { $ref: '#/components/responses/NotFound' }
        '500': { $ref: '#/components/responses/InternalError' }
  /taxonomies/ingredients:
    get:
      tags: [Taxonomies]
      summary: Ingredient list
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/SuccessResponse'
                  - type: object
                    properties:
                      data:
                        type: array
                        items: { $ref: '#/components/schemas/Ingredient' }
        '500': { $ref: '#/components/responses/InternalError' }
  /taxonomies/flags:
    get:
      tags: [Taxonomies]
      summary: Flag list
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/SuccessResponse'
                  - type: object
                    properties:
                      data:
                        type: array
                        items: { $ref: '#/components/schemas/Flag' }
        '500': { $ref: '#/components/responses/InternalError' }
  /taxonomies/dough-types:
    get:
      tags: [Taxonomies]
      summary: Dough type list
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/SuccessResponse'
                  - type: object
                    properties:
                      data:
                        type: array
                        items: { $ref: '#/components/schemas/DoughType' }
        '500': { $ref: '#/components/responses/InternalError' }
  /taxonomies/size-options:
    get:
      tags: [Taxonomies]
      summary: Size list
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/SuccessResponse'
                  - type: object
                    properties:
                      data:
                        type: array
                        items: { $ref: '#/components/schemas/SizeOption' }
        '500': { $ref: '#/components/responses/InternalError' }
'@

$path = "src/docs/openapi.yaml"
Set-Content -Path $path -Value $content -Encoding utf8
Write-Host "✅ Documentația OpenAPI a fost actualizată în $path"
