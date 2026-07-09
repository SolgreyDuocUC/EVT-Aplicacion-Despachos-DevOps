-- Poblado inicial de la tabla venta
INSERT INTO venta (id_venta, direccion_compra, valor_compra, fecha_compra, despacho_generado) VALUES
(1, 'Av. Libertad 1245, Depto 402, Viña del Mar', 45000, '2026-07-01', 1),
(2, 'Calle Valparaíso 432, Quilpué', 15000, '2026-07-02', 1),
(3, 'Paseo Latorre 78, Villa Alemana', 89990, '2026-07-03', 1),
(4, 'Av. Uno Norte 810, Viña del Mar', 12500, '2026-07-03', 0),
(5, 'Condell 1123, Valparaíso', 34000, '2026-07-04', 1),
(6, 'Av. Los Carrera 1520, Quilpué', 62000, '2026-07-05', 1),
(7, 'Santiago Linch 450, Olmué', 105000, '2026-07-06', 1),
(8, 'Arlegui 633, Of. 501, Viña del Mar', 22500, '2026-07-07', 0),
(9, 'Av. Valparaíso 1024, Villa Alemana', 55000, '2026-07-08', 1),
(10, 'Plaza Aníbal Pinto 56, Valparaíso', 18900, '2026-07-09', 0)
ON DUPLICATE KEY UPDATE id_venta=id_venta;