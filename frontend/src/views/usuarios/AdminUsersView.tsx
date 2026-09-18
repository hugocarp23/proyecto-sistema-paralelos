import React, { useState, useEffect } from 'react';
import { userService } from '../../services/user.service';
import { User } from '../../interfaces/auth';
import { UserTable } from '../../components/usuarios/UserTable';
import { Loader } from '../../components/common/Loader';
import { Input } from '../../components/common/Input';
import { Users, Search, Filter } from 'lucide-react';

export const AdminUsersView: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Array<{ id: number; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const [usersData, rolesData] = await Promise.all([
        userService.getAllUsers({
          search: searchTerm || undefined,
          roleId: selectedRole ? Number(selectedRole) : undefined,
        }),
        userService.getRoles(),
      ]);
      setUsers(usersData);
      setRoles(rolesData);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [selectedRole]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleToggleStatus = async (userId: number, currentStatus: boolean) => {
    try {
      await userService.updateUserStatus(userId, !currentStatus);
      fetchUsers();
    } catch (e) {
      console.error(e);
    }
  };

  const handleChangeRole = async (userId: number, newRoleId: number) => {
    try {
      await userService.updateUserRole(userId, newRoleId);
      fetchUsers();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading && users.length === 0) {
    return <Loader message="Cargando directorio de usuarios de EventHub..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-400" />
            <span>Administración de Cuentas y Roles</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Gestiona permisos, activación y estados de acceso para administradores, organizadores y asistentes
          </p>
        </div>

        {/* Buscador y filtro por rol */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-xs rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-brand-500"
          >
            <option value="">Todos los roles</option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>

          <form onSubmit={handleSearchSubmit} className="relative sm:w-64">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre o correo..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5 pointer-events-none" />
          </form>
        </div>
      </div>

      <UserTable
        users={users}
        roles={roles}
        onToggleStatus={handleToggleStatus}
        onChangeRole={handleChangeRole}
      />
    </div>
  );
};
