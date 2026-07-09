-- Poblado inicial de la tabla despacho
INSERT INTO despacho (id_despacho, id_compra, direccion_compra, valor_compra, fecha_despacho, patente_camion, intento, despachado) VALUES
(1, 1, 'Av. Libertad 1245, Depto 402, Viña del Mar', 45000, '2026-07-02', 'GK-TL-42', 1, 1),
(2, 2, 'Calle Valparaíso 432, Quilpué', 15000, '2026-07-03', 'HP-RX-88', 1, 1),
(3, 3, 'Paseo Latorre 78, Villa Alemana', 89990, '2026-07-04', 'GK-TL-42', 1, 1),
(4, 5, 'Condell 1123, Valparaíso', 34000, '2026-07-06', 'K1-23-BB', 2, 1),
(5, 6, 'Av. Los Carrera 1520, Quilpué', 62000, '2026-07-08', 'HP-RX-88', 1, 1),
(6, 7, 'Santiago Linch 450, Olmué', 105000, '2026-07-09', 'K1-23-BB', 1, 0),
(7, 9, 'Av. Valparaíso 1024, Villa Alemana', 55000, '2026-07-09', 'GK-TL-42', 1, 0)
ON DUPLICATE KEY UPDATE id_despacho=id_despacho;