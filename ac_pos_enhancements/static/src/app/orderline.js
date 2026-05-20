/** @odoo-module **/
import { patch } from "@web/core/utils/patch";
import { Orderline } from "@point_of_sale/app/components/orderline/orderline";
import { formatCurrency } from "@web/core/currency";

patch(Orderline.prototype, {
    get lineScreenValues() {
        // Spread into a new object — super's return may be a reactive proxy
        // that doesn't accept mutation in some Odoo 19 builds.
        const vals = { ...super.lineScreenValues };
        try {
            const line = this.line;
            if (!line || !line.order_id) {
                return vals;
            }

            // ---- Line index (1-based) ----
            const orderLines = line.order_id.lines;
            if (orderLines && orderLines.length) {
                const idx = orderLines.findIndex(
                    (l) => l === line || (l && line && l.id && l.id === line.id)
                );
                if (idx >= 0) {
                    vals.lineIndex = idx + 1;
                }
            }

            // ---- Original catalog price vs current price ----
            const mode = this.props && this.props.mode;
            const basic = this.props && this.props.basic_receipt;
            const product = line.product_id;
            const originalUnit = product && product.lst_price ? product.lst_price : 0;
            const currentUnit = line.price_unit || 0;
            const isModified =
                !basic &&
                mode !== "receipt" &&
                originalUnit > 0 &&
                Math.abs(currentUnit - originalUnit) > 0.0001;
            if (isModified && line.currency && line.currency.id) {
                vals.isPriceModified = true;
                vals.originalUnitPrice = formatCurrency(originalUnit, line.currency.id);
                vals.priceDelta = formatCurrency(originalUnit - currentUnit, line.currency.id);
            }
        } catch (err) {
            // Never crash the POS render — log and fall back to base vals.
            console.warn("ac_pos_enhancements: lineScreenValues error", err);
        }
        return vals;
    },
});
