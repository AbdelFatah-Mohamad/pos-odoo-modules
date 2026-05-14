/** @odoo-module **/
import { patch } from "@web/core/utils/patch";
import { Orderline } from "@point_of_sale/app/components/orderline/orderline";
import { formatCurrency } from "@web/core/currency";

patch(Orderline.prototype, {
    get lineScreenValues() {
        const vals = super.lineScreenValues;
        const line = this.line;
        if (!line.order_id) {
            return vals;
        }

        // Line index (1-based) in this order's visible lines
        const lines = line.order_id.lines || [];
        const idx = lines.findIndex((l) => l === line);
        vals.lineIndex = idx >= 0 ? idx + 1 : 0;

        // Original catalog price — what the product would cost without manual change.
        // Compares against product.lst_price (the standard catalog price).
        const product = line.product_id;
        const originalUnit = product?.lst_price ?? 0;
        const currentUnit = line.price_unit ?? 0;
        // Tolerance: 0.0001 to avoid floating-point flicker
        vals.isPriceModified =
            !this.props.basic_receipt &&
            this.props.mode !== "receipt" &&
            originalUnit > 0 &&
            Math.abs(currentUnit - originalUnit) > 0.0001;
        if (vals.isPriceModified) {
            vals.originalUnitPrice = formatCurrency(originalUnit, line.currency.id);
            vals.priceDelta = formatCurrency(originalUnit - currentUnit, line.currency.id);
        }
        return vals;
    },
});
