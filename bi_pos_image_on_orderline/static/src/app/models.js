import { PosOrderline } from "@point_of_sale/app/models/pos_order_line";
import { patch } from "@web/core/utils/patch";
import { CustomerDisplayPosAdapter } from "@point_of_sale/app/customer_display/customer_display_adapter";


patch(PosOrderline.prototype, {
    setup() {
    super.setup(...arguments);
    },

    getDisplayData() {
        return {
        ...super.getDisplayData(),
         product_id: this.getProduct().id,
        };
        }
});

patch(CustomerDisplayPosAdapter.prototype, {
    formatOrderData(order) {
        super.formatOrderData(order);
        this.data.onlinePaymentData = { ...(order.onlinePaymentData || {}) };
    },
    getOrderlineData(line) {
        const data = super.getOrderlineData(line);
        data.product_id =  line.getProduct().id;
         console.log('-data.product_id---------',data.product_id);
        return data;
    },
});



    // patch(Orderline, {
    //     props: {
    //          ...Orderline.props,
    //     line: {
    //         ...Orderline.props.line,
    //     shape: {
    //         ...Orderline.props.line.shape,
    //     product_id: { type: Number, optional: true },
    //         },
    //         },
    //     },
    // });