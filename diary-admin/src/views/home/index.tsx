import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Skeleton, List, Typography, Divider, Avatar } from 'antd';
import { LikeOutlined, FireTwoTone } from '@ant-design/icons';
import useSSE from '@/utils/useSSE';
import { getAllTrips } from '@/api/manage';
import { Trip } from '@/api/manage';

const Home = () => {
  const [counts, setCounts] = useState({
    waiting: 0,
    passed: 0,
    rejected: 0,
    total: 0,
  });

  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = "/event/audit/count";
    const cleanup = useSSE(url, {
      onOpen: (response) => console.log("Connection opened", response),
      onMessage: (event) => {
        const data = JSON.parse(event.data);
        setCounts(data);
      },
      onError: (error) => console.error("Error:", error),
      onClose: () => console.log("Connection closed"),
    });
    return cleanup;
  }, []);

  useEffect(() => {
    getAllTrips()
      .then((res: any) => {
        const sorted = [...res.data]
          .sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0))
          .slice(0, 10);
        setTrips(sorted);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="event-page">
      <Row gutter={16}>
        {counts.total === 0 ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Col span={6} key={index}>
              <Card>
                <Skeleton active paragraph={{ rows: 1 }} title={false} />
              </Card>
            </Col>
          ))
        ) : (
          <>
            <Col span={6}>
              <Card className="stat-card">
                <Statistic title="待审核" value={counts.waiting} valueStyle={{ fontSize: '24px' }} />
              </Card>
            </Col>
            <Col span={6}>
              <Card className="stat-card">
                <Statistic title="审核通过" value={counts.passed} valueStyle={{ fontSize: '24px', color: '#3f8600' }} />
              </Card>
            </Col>
            <Col span={6}>
              <Card className="stat-card">
                <Statistic title="审核拒绝" value={counts.rejected} valueStyle={{ fontSize: '24px', color: '#cf1322' }} />
              </Card>
            </Col>
            <Col span={6}>
              <Card className="stat-card">
                <Statistic title="总计" value={counts.total} valueStyle={{ fontSize: '24px', color: '#1890ff' }} />
              </Card>
            </Col>
          </>
        )}
      </Row>
      <Divider />
      <Typography.Title level={4} style={{ marginTop: 24, marginBottom: 20}}>
        <FireTwoTone twoToneColor="#b32922" style={{ marginRight: 3 }} /> 热门游记Top10
      </Typography.Title>

      {loading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : (
        <List
          grid={{ gutter: 16, column: 4 }}
          dataSource={trips}
          renderItem={(trip) => (
            <List.Item key={trip.id}>
              <Card
                hoverable
                cover={
                  <img
                    src={trip.images[0]}
                    alt="封面"
                    style={{ height: 160, objectFit: 'cover' }}
                  />
                }
              >
                <Card.Meta
                  title={trip.title}
                  description={
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span><LikeOutlined /> {trip.likeCount || 0}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Avatar size={24} src={trip.avatar} />
                        <span style={{ fontSize: 12, color: '#999' }}>{trip.username}</span>
                      </div>
                    </div>
                  }
                />
              </Card>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default Home;