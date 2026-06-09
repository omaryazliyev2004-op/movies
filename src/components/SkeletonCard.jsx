import { Card, CardContent, Box, Skeleton } from "@mui/material";

export default function SkeletonCard() {
  return (
    <Card sx={{ height: "100%", overflow: "hidden" }}>
      <Skeleton
        variant="rectangular"
        height="100%"
        animation="wave"
        sx={{ borderRadius: "16px 16px 0 0", minHeight: { xs: 240, sm: 280, md: 300 } }}
      />
      <CardContent sx={{ p: 1.5 }}>
        <Skeleton variant="text" width="80%" height={24} animation="wave" />
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
          <Skeleton variant="text" width="40%" height={18} animation="wave" />
          <Skeleton variant="text" width="30%" height={18} animation="wave" />
        </Box>
      </CardContent>
    </Card>
  );
}
