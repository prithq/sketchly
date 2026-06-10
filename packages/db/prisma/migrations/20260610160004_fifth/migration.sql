-- CreateTable
CREATE TABLE "Shape" (
    "id" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "roomId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Shape_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Shape_roomId_idx" ON "Shape"("roomId");

-- CreateIndex
CREATE INDEX "Shape_userId_idx" ON "Shape"("userId");

-- CreateIndex
CREATE INDEX "Room_ownerId_idx" ON "Room"("ownerId");

-- AddForeignKey
ALTER TABLE "Shape" ADD CONSTRAINT "Shape_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shape" ADD CONSTRAINT "Shape_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
