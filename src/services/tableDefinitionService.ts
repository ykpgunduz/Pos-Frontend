import { api } from './api';

export interface TableDefinition {
  id: number;
  cafe_id: number;
  name: string;
  area: string | null;
  table_number: number;
  capacity: number | null;
  position_x: string | null;
  position_y: string | null;
  is_active: boolean;
  notes: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreateTableRequest {
  cafe_id: number;
  name: string;
  area?: string;
  table_number: number;
  capacity?: number;
  position_x?: string;
  position_y?: string;
  is_active?: boolean;
  notes?: string;
}

export interface UpdateTableRequest {
  cafe_id?: number;
  name?: string;
  area?: string;
  table_number?: number;
  capacity?: number;
  position_x?: string;
  position_y?: string;
  is_active?: boolean;
  notes?: string;
}

class TableDefinitionService {
  // Tüm masaları listele (sayfalı)
  async getAllTables(page: number = 1) {
    const response = await api.get(`/table-definitions/list?page=${page}`);
    return response.data;
  }

  // Belirli bir kafeye ait masaları getir
  async getTablesByCafe(cafeId: number): Promise<TableDefinition[]> {
    const response = await api.get(`/table-definitions/cafe/${cafeId}`);
    return response.data;
  }

  // Tekil masa detayı
  async getTableById(tableId: number): Promise<TableDefinition> {
    const response = await api.get(`/table-definitions/${tableId}`);
    return response.data;
  }

  // Yeni masa oluştur
  async createTable(data: CreateTableRequest): Promise<TableDefinition> {
    const response = await api.post('/table-definitions/create', data);
    return response.data;
  }

  // Masa güncelle
  async updateTable(tableId: number, data: UpdateTableRequest): Promise<TableDefinition> {
    const response = await api.patch(`/table-definitions/${tableId}/update`, data);
    return response.data;
  }

  // Masa sil
  async deleteTable(tableId: number): Promise<{ deleted: boolean }> {
    const response = await api.delete(`/table-definitions/${tableId}/delete`);
    return response.data;
  }

  // Masa pozisyonunu güncelle
  async updateTablePosition(tableId: number, x: number, y: number): Promise<TableDefinition> {
    const response = await api.patch(`/table-definitions/${tableId}/update`, {
      position_x: x.toString(),
      position_y: y.toString(),
    });
    return response.data;
  }

  // Toplu pozisyon güncelleme
  async updateMultiplePositions(updates: Array<{ id: number; x: number; y: number }>) {
    const promises = updates.map(update =>
      this.updateTablePosition(update.id, update.x, update.y)
    );
    return Promise.all(promises);
  }
}

export const tableDefinitionService = new TableDefinitionService();
