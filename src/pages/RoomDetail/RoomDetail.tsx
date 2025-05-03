
import AsideRoom from './AsideRoom'
import CommentRoom from './CommentRoom'
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { RootState } from '../../main';

export default function RoomDetail() {
    const { roomId } = useParams();
    const { user } = useSelector((state: RootState) => state.userSlice);
    return (
        <div>
            <AsideRoom />
            <CommentRoom maNguoiDung={user.id} maPhong={Number(roomId)} />
        </div>
    )
}
