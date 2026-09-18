import React from 'react';
import { User } from '../../interfaces/auth';
import { Badge } from '../common/Badge';
import { Shield, User as UserIcon, CheckCircle2, XCircle } from 'lucide-react';

interface UserTableProps {
  users: User[];
  roles: Array<{ id: number; name: string }>;
  onToggleStatus: (userId: number, currentStatus: boolean) => void;
  onChangeRole: (userId: number, newRoleId: number) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  roles,
  onToggleStatus,
  onChangeRole,
}) => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-md">
      <table className="w-full text-left text-sm text-slate-300">
        <thead className="bg-slate-950/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
          <tr>
            <th className="px-6 py-4">Usuario</th>
            <th className="px-6 py-4">Correo</th>
            <th className="px-6 py-4">Rol</th>
            <th className="px-6 py-4">Estado</th>
            <th className="px-6 py-4 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-slate-800/50 transition-colors">
              <td className="px-6 py-4 font-semibold text-slate-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-xs">
                  {u.firstName[0]}
                  {u.lastName[0]}
                </div>
                <div>
                  <p>{u.firstName} {u.lastName}</p>
                  <span className="text-[11px] text-slate-500 font-mono">ID: #{u.id}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-slate-300">{u.email}</td>
              <td className="px-6 py-4">
                <select
                  value={u.roleId || (u.role === 'ADMIN' ? 1 : u.role === 'ORGANIZADOR' ? 2 : 3)}
                  onChange={(e) => onChangeRole(u.id, Number(e.target.value))}
                  className="bg-slate-950 border border-slate-700 text-xs rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-brand-500"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-6 py-4">
                <Badge variant={u.active ? 'success' : 'danger'} dot size="sm">
                  {u.active ? 'Activo' : 'Inactivo'}
                </Badge>
              </td>
              <td className="px-6 py-4 text-right">
                <button
                  onClick={() => onToggleStatus(u.id, !!u.active)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    u.active
                      ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {u.active ? 'Desactivar' : 'Activar'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
