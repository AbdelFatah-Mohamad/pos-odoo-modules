# -*- coding: utf-8 -*-
{
    'name': 'AC POS Enhancements',
    'version': '19.0.1.0.0',
    'category': 'Point of Sale',
    'summary': 'Show original price + line numbers on POS orderlines',
    'author': 'AlshayebCo',
    'depends': ['point_of_sale'],
    'data': [],
    'assets': {
        'point_of_sale._assets_pos': [
            'ac_pos_enhancements/static/src/app/orderline.js',
            'ac_pos_enhancements/static/src/app/orderline.xml',
        ],
    },
    'installable': True,
    'auto_install': False,
    'license': 'LGPL-3',
}
